/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PlayerState, GameClockState, EntityState } from '../../types/game';

interface SimulationCanvasProps {
  playerState: PlayerState;
  clockState: GameClockState;
  entityState: EntityState;
  cameraMode: 'fps' | 'cctv';
  onPlayerMove: (pos: { x: number; z: number }) => void;
  onInteractAvailable: (target: { type: 'desk' | 'cabinet' | 'document' | 'battery' | 'sedative'; id: string; label: string } | null) => void;
  onFootstepTrigger: () => void;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  playerState,
  clockState,
  entityState,
  cameraMode,
  onPlayerMove,
  onInteractAvailable,
  onFootstepTrigger
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Player 3D coordinates
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 6));
  const playerYawRef = useRef<number>(0);
  const playerPitchRef = useRef<number>(0);
  
  // Keys down
  const keysRef = useRef<{ [key: string]: boolean }>({});
  
  // 3D Objects references
  const flashlightRef = useRef<THREE.SpotLight | null>(null);
  const flashlightTargetRef = useRef<THREE.Object3D | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const ceilingLightsRef = useRef<THREE.PointLight[]>([]);
  const emergencyRedLightRef = useRef<THREE.PointLight | null>(null);
  const caretakerMeshRef = useRef<THREE.Group | null>(null);
  const patientMeshRef = useRef<THREE.Group | null>(null);
  const deskLampRef = useRef<THREE.PointLight | null>(null);

  // References for interactive props in scene
  const interactablesRef = useRef<Array<{
    type: 'desk' | 'cabinet' | 'document' | 'battery' | 'sedative';
    id: string;
    position: THREE.Vector3;
    label: string;
  }>>([]);

  // Footstep cadence timer
  const lastStepTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040507);
    scene.fog = new THREE.FogExp2(0x040507, 0.08);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 6);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Build the Blackwood Historical Archive Environment
    buildEnvironment(scene);

    // Build interactive scene objects
    buildInteractables(scene);

    // Build Entities (Caretaker and Patient)
    buildEntities(scene);

    // Mouse look handlers
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      playerYawRef.current -= deltaX * 0.0035;
      playerPitchRef.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, playerPitchRef.current - deltaY * 0.0035));
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Keyboard handlers
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Window resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update player movement if not hidden
      if (!playerState.isHidden) {
        updateMovement(delta);
      }

      // Update camera
      updateCamera();

      // Update lighting based on clock & blackout
      updateLighting(time);

      // Update Caretaker & Patient animations
      updateEntityVisuals(time);

      // Check proximity for interaction prompt
      checkProximity();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const buildEnvironment = (scene: THREE.Scene) => {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(24, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c22,
      roughness: 0.85,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor grid markings for industrial archive look
    const grid = new THREE.GridHelper(36, 18, 0x242832, 0x181a20);
    grid.position.y = 0.01;
    scene.add(grid);

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(24, 36);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x0f1115, roughness: 0.95 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 4.2;
    scene.add(ceil);

    // Overhead industrial pipes and steel girders (Where Patient crawls!)
    for (let z = -14; z <= 14; z += 5) {
      const girderGeo = new THREE.BoxGeometry(24, 0.35, 0.35);
      const girderMat = new THREE.MeshStandardMaterial({ color: 0x1f2228, metalness: 0.7, roughness: 0.5 });
      const girder = new THREE.Mesh(girderGeo, girderMat);
      girder.position.set(0, 3.9, z);
      scene.add(girder);

      const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 24, 12);
      const pipeMat = new THREE.MeshStandardMaterial({ color: 0x3d3126, roughness: 0.6 });
      const pipe = new THREE.Mesh(pipeGeo, pipeMat);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, 3.65, z + 0.5);
      scene.add(pipe);
    }

    // Walls (North, South, East, West)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x13161c, roughness: 0.9 });
    
    // North wall (Back of archive)
    const wallN = new THREE.Mesh(new THREE.BoxGeometry(24, 4.2, 0.4), wallMat);
    wallN.position.set(0, 2.1, -18);
    wallN.receiveShadow = true;
    scene.add(wallN);

    // South wall (Entrance security door)
    const wallS = new THREE.Mesh(new THREE.BoxGeometry(24, 4.2, 0.4), wallMat);
    wallS.position.set(0, 2.1, 18);
    wallS.receiveShadow = true;
    scene.add(wallS);

    // West & East walls
    const wallW = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, 36), wallMat);
    wallW.position.set(-12, 2.1, 0);
    wallW.receiveShadow = true;
    scene.add(wallW);

    const wallE = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.2, 36), wallMat);
    wallE.position.set(12, 2.1, 0);
    wallE.receiveShadow = true;
    scene.add(wallE);

    // Tall Rusted Archive Filing Shelves lining corridors
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x22272e, metalness: 0.5, roughness: 0.6 });
    for (let x = -8; x <= 8; x += 8) {
      for (let z = -12; z <= 8; z += 4.5) {
        // Shelf row
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 1.2), cabinetMat);
        shelf.position.set(x, 1.6, z);
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        scene.add(shelf);
      }
    }

    // Ambient light (Dim, ominous cold blue)
    const amb = new THREE.AmbientLight(0x0c111c, 0.25);
    scene.add(amb);
    ambientLightRef.current = amb;

    // Normal Ceiling Fluorescent tubes
    ceilingLightsRef.current = [];
    [-10, 0, 10].forEach(zPos => {
      const tubeLight = new THREE.PointLight(0xdce6f2, 0.7, 14);
      tubeLight.position.set(0, 3.8, zPos);
      tubeLight.castShadow = true;
      tubeLight.shadow.bias = -0.001;
      scene.add(tubeLight);
      ceilingLightsRef.current.push(tubeLight);

      // Tube visual mesh
      const tubeMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 3, 8),
        new THREE.MeshBasicMaterial({ color: 0xeef4fa })
      );
      tubeMesh.rotation.z = Math.PI / 2;
      tubeMesh.position.set(0, 4.0, zPos);
      scene.add(tubeMesh);
    });

    // Emergency Red Strobe Light (Fires during 03:00 - 03:10 blackout!)
    const redLight = new THREE.PointLight(0xff1122, 0, 22);
    redLight.position.set(0, 3.9, 0);
    scene.add(redLight);
    emergencyRedLightRef.current = redLight;

    // Flashlight SpotLight (Attached to player)
    const flashlight = new THREE.SpotLight(0xffeedd, 1.6, 20, Math.PI / 6, 0.45, 1.2);
    flashlight.castShadow = true;
    flashlight.shadow.mapSize.width = 1024;
    flashlight.shadow.mapSize.height = 1024;
    scene.add(flashlight);
    flashlightRef.current = flashlight;

    const targetObj = new THREE.Object3D();
    scene.add(targetObj);
    flashlight.target = targetObj;
    flashlightTargetRef.current = targetObj;
  };

  const buildInteractables = (scene: THREE.Scene) => {
    interactablesRef.current = [];

    // 1. Archivist Master Desk (Center-left)
    const deskGroup = new THREE.Group();
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.1, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.7 })
    );
    deskTop.position.set(0, 0.8, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, metalness: 0.8 });
    [[-1.2, -0.6], [1.2, -0.6], [-1.2, 0.6], [1.2, 0.6]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), legMat);
      leg.position.set(lx, 0.4, lz);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Green Banker Lamp on desk
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3), new THREE.MeshStandardMaterial({ color: 0xa88734, metalness: 0.8 }));
    lampBase.position.set(0.8, 0.95, -0.3);
    deskGroup.add(lampBase);

    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.18, 0.15, 12),
      new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.3 })
    );
    lampShade.rotation.z = Math.PI / 2;
    lampShade.position.set(0.8, 1.15, -0.3);
    deskGroup.add(lampShade);

    const lampLight = new THREE.PointLight(0xa7f3d0, 0.8, 4.5);
    lampLight.position.set(0.8, 1.1, -0.3);
    deskGroup.add(lampLight);
    deskLampRef.current = lampLight;

    deskGroup.position.set(-2, 0, 4);
    scene.add(deskGroup);

    interactablesRef.current.push({
      type: 'desk',
      id: 'desk_1',
      position: new THREE.Vector3(-2, 0, 4),
      label: 'Archivist Desk [CRAWL UNDER TO HIDE]'
    });

    // 2. Hideable Tall Metal File Cabinet (Right side)
    const cabinetGroup = new THREE.Group();
    const cabMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.6, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 })
    );
    cabMesh.position.y = 1.3;
    cabMesh.castShadow = true;
    cabinetGroup.add(cabMesh);
    cabinetGroup.position.set(4, 0, 2);
    scene.add(cabinetGroup);

    interactablesRef.current.push({
      type: 'cabinet',
      id: 'cabinet_1',
      position: new THREE.Vector3(4, 0, 2),
      label: 'Tall File Locker [STEP INSIDE TO HIDE]'
    });

    // 3. Document Pickup on desk
    const docMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.02, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 })
    );
    docMesh.position.set(-2.2, 0.86, 3.8);
    scene.add(docMesh);

    interactablesRef.current.push({
      type: 'document',
      id: 'doc_1',
      position: new THREE.Vector3(-2.2, 0.86, 3.8),
      label: 'Classified 1928 Asylum Intake File [INSPECT & SORT]'
    });

    // 4. Battery pack near shelf
    const battMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.1, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 })
    );
    battMesh.position.set(-6, 0.5, 0);
    scene.add(battMesh);

    interactablesRef.current.push({
      type: 'battery',
      id: 'batt_1',
      position: new THREE.Vector3(-6, 0.5, 0),
      label: 'Heavy Flashlight Battery Cell [PICK UP]'
    });

    // 5. Sedative Pill Bottle near desk drawer
    const pillMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2 })
    );
    pillMesh.position.set(-1.4, 0.88, 4.3);
    scene.add(pillMesh);

    interactablesRef.current.push({
      type: 'sedative',
      id: 'pill_1',
      position: new THREE.Vector3(-1.4, 0.88, 4.3),
      label: 'Phenobarbital Sedative Bottle [COLLECT PILLS]'
    });
  };

  const buildEntities = (scene: THREE.Scene) => {
    // 1. "The Caretaker" 3D entity group
    const caretaker = new THREE.Group();
    
    // Slender tall body (2.8m tall)
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.18, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 0.95 })
    );
    torso.position.y = 1.8;
    caretaker.add(torso);

    // Head (faceless, pale grayish-black)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.8 })
    );
    head.scale.set(0.9, 1.3, 0.9);
    head.position.y = 2.65;
    caretaker.add(head);

    // Glowing hollow optical pits
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyeMat);
    eyeL.position.set(-0.06, 2.68, 0.16);
    caretaker.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyeMat);
    eyeR.position.set(0.06, 2.68, 0.16);
    caretaker.add(eyeR);

    // Long slender arms
    const armMat = new THREE.MeshStandardMaterial({ color: 0x08090c });
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 1.6), armMat);
    armL.position.set(-0.35, 1.6, 0);
    caretaker.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 1.6), armMat);
    armR.position.set(0.35, 1.6, 0);
    caretaker.add(armR);

    // Long thin legs
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 1.5), armMat);
    legL.position.set(-0.16, 0.75, 0);
    caretaker.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 1.5), armMat);
    legR.position.set(0.16, 0.75, 0);
    caretaker.add(legR);

    caretaker.position.set(0, 0, -14); // starts deep in the north corridor
    caretaker.visible = false;
    scene.add(caretaker);
    caretakerMeshRef.current = caretaker;

    // 2. "The Patient" ceiling crawler entity
    const patient = new THREE.Group();
    const patientBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6 })
    );
    patientBody.scale.set(1.4, 0.6, 0.8);
    patient.add(patientBody);

    // Sprawled ceiling limbs clinging to overhead girders
    const limbMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    [[-0.4, 0.3], [0.4, 0.3], [-0.5, -0.3], [0.5, -0.3]].forEach(([lx, lz]) => {
      const limb = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 1.2), limbMat);
      limb.rotation.x = Math.PI / 4;
      limb.position.set(lx, 0.2, lz);
      patient.add(limb);
    });

    patient.position.set(0, 3.8, -5);
    scene.add(patient);
    patientMeshRef.current = patient;
  };

  const updateMovement = (delta: number) => {
    const speed = 3.2 * delta;
    const dir = new THREE.Vector3();
    const forward = new THREE.Vector3(-Math.sin(playerYawRef.current), 0, -Math.cos(playerYawRef.current));
    const right = new THREE.Vector3(Math.cos(playerYawRef.current), 0, -Math.sin(playerYawRef.current));

    let moved = false;
    if (keysRef.current['w'] || keysRef.current['arrowup']) {
      dir.add(forward);
      moved = true;
    }
    if (keysRef.current['s'] || keysRef.current['arrowdown']) {
      dir.sub(forward);
      moved = true;
    }
    if (keysRef.current['a'] || keysRef.current['arrowleft']) {
      dir.sub(right);
      moved = true;
    }
    if (keysRef.current['d'] || keysRef.current['arrowright']) {
      dir.add(right);
      moved = true;
    }

    if (moved) {
      dir.normalize();
      playerPosRef.current.addScaledVector(dir, speed);
      
      // Clamp boundaries inside archive room
      playerPosRef.current.x = Math.max(-10, Math.min(10, playerPosRef.current.x));
      playerPosRef.current.z = Math.max(-16, Math.min(16, playerPosRef.current.z));

      // Trigger footstep cadence audio
      const now = performance.now();
      if (now - lastStepTimeRef.current > 480) {
        lastStepTimeRef.current = now;
        onFootstepTrigger();
      }

      onPlayerMove({ x: playerPosRef.current.x, z: playerPosRef.current.z });
    }
  };

  const updateCamera = () => {
    if (!cameraRef.current) return;

    if (cameraMode === 'fps') {
      if (playerState.isHidden) {
        // Claustrophobic low POV under desk or inside cabinet
        if (playerState.hidingSpot === 'desk') {
          cameraRef.current.position.set(-2, 0.45, 4);
        } else {
          cameraRef.current.position.set(4, 1.2, 2);
        }
      } else {
        // Eye-level First Person
        cameraRef.current.position.copy(playerPosRef.current);
      }

      // Rotate camera
      const euler = new THREE.Euler(playerPitchRef.current, playerYawRef.current, 0, 'YXZ');
      cameraRef.current.quaternion.setFromEuler(euler);

      // Flashlight attached to camera
      if (flashlightRef.current && flashlightTargetRef.current) {
        flashlightRef.current.position.copy(cameraRef.current.position);
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion);
        flashlightTargetRef.current.position.copy(cameraRef.current.position).add(forward.multiplyScalar(10));
      }
    } else {
      // CCTV Tactical Isometric view from high ceiling corner
      cameraRef.current.position.set(9, 8.5, 12);
      cameraRef.current.lookAt(playerPosRef.current);

      if (flashlightRef.current && flashlightTargetRef.current) {
        flashlightRef.current.position.copy(playerPosRef.current);
        flashlightRef.current.position.y += 0.5;
        const forward = new THREE.Vector3(-Math.sin(playerYawRef.current), 0, -Math.cos(playerYawRef.current));
        flashlightTargetRef.current.position.copy(playerPosRef.current).add(forward.multiplyScalar(6));
      }
    }
  };

  const updateLighting = (time: number) => {
    const isBlackout = clockState.isBlackout;

    // Normal ceiling fluorescent lights
    ceilingLightsRef.current.forEach((light, i) => {
      if (isBlackout) {
        // Pitch black during blackout
        light.intensity = 0;
      } else {
        // Minor atmospheric fluorescent buzz flicker
        const flicker = 0.65 + Math.sin(time * 8 + i * 2) * 0.08 + (Math.random() < 0.02 ? -0.4 : 0);
        light.intensity = Math.max(0.1, flicker);
      }
    });

    // Desk Banker Lamp
    if (deskLampRef.current) {
      deskLampRef.current.intensity = isBlackout ? 0 : 0.85;
    }

    // Emergency Red Strobe during 03:00 - 03:10 blackout
    if (emergencyRedLightRef.current) {
      if (isBlackout) {
        // Slow pulsing ominous red emergency warning sweep
        emergencyRedLightRef.current.intensity = Math.max(0, Math.sin(time * 3.5)) * 1.4;
      } else {
        emergencyRedLightRef.current.intensity = 0;
      }
    }

    // Flashlight battery & flicker
    if (flashlightRef.current) {
      if (!playerState.isFlashlightOn || playerState.flashlightBattery <= 0) {
        flashlightRef.current.intensity = 0;
      } else {
        let intensity = 1.6;
        // Low battery dying flicker
        if (playerState.flashlightBattery < 20) {
          intensity = Math.random() < 0.25 ? 0.2 : 1.1;
        }
        flashlightRef.current.intensity = intensity;
      }
    }
  };

  const updateEntityVisuals = (time: number) => {
    // 1. Caretaker patrolling hall during blackout
    if (caretakerMeshRef.current) {
      if (clockState.isBlackout || entityState.caretakerActive) {
        caretakerMeshRef.current.visible = true;
        // Slowly stalking along Z axis towards player
        const targetZ = -12 + (Math.sin(time * 0.4) + 1) * 8;
        caretakerMeshRef.current.position.z = THREE.MathUtils.lerp(caretakerMeshRef.current.position.z, targetZ, 0.02);
        
        // Subtle terrifying vertical breathing sway
        caretakerMeshRef.current.position.y = Math.sin(time * 2) * 0.04;
      } else {
        caretakerMeshRef.current.visible = false;
      }
    }

    // 2. Patient crawling along ceiling
    if (patientMeshRef.current) {
      // Twitching and stalking on ceiling girders
      patientMeshRef.current.position.x = Math.sin(time * 0.8) * 3.5;
      patientMeshRef.current.rotation.y = Math.sin(time * 0.5) * 0.4;
    }
  };

  const checkProximity = () => {
    const pPos = playerPosRef.current;
    let closestItem: { type: 'desk' | 'cabinet' | 'document' | 'battery' | 'sedative'; id: string; label: string } | null = null;
    let minDist = 2.2;

    interactablesRef.current.forEach(item => {
      const dist = pPos.distanceTo(item.position);
      if (dist < minDist) {
        minDist = dist;
        closestItem = item;
      }
    });

    onInteractAvailable(closestItem);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full cursor-crosshair overflow-hidden select-none"
    >
      {/* Click-to-look drag instructional helper */}
      <div className="absolute bottom-3 left-4 z-10 pointer-events-none text-[11px] text-zinc-400 font-mono-code bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-zinc-800/80">
        WASD to Move · Click & Drag to Aim Flashlight · [F] Flashlight · [E] Interact/Hide
      </div>
    </div>
  );
};
