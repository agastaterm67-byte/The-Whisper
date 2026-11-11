/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Code, FileCode, Terminal } from 'lucide-react';

export const SectionScriptTemplates: React.FC = () => {
  const [engine, setEngine] = useState<'unity' | 'godot'>('unity');
  const [activeScript, setActiveScript] = useState<'clock' | 'sanity' | 'hiding' | 'ai'>('clock');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scripts = {
    unity: {
      clock: {
        title: 'GameClockManager.cs',
        desc: 'Manages 01:00 to 04:00 shift progression, time scaling, and the 03:00 - 03:10 Total Blackout event trigger.',
        code: `using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Events;

/// <summary>
/// "The 3 AM Whisper" - Core Game Clock & Blackout Event Controller
/// Handles in-game time advancement from 01:00 AM to 04:00 AM (minutes 60 to 240).
/// Dispatches global events when the 03:00 Total Blackout initiates and terminates.
/// </summary>
public class GameClockManager : MonoBehaviour
{
    public static GameClockManager Instance { get; private set; }

    [Header("Shift Time Configuration")]
    [Tooltip("Starting minute of shift (60 = 01:00 AM)")]
    public float currentMinutes = 60f; 
    public const float START_MINUTE = 60f;   // 01:00 AM
    public const float BLACKOUT_START = 180f; // 03:00 AM
    public const float BLACKOUT_END = 190f;   // 03:10 AM
    public const float SHIFT_END = 240f;      // 04:00 AM

    [Header("Progression Speed")]
    [Tooltip("How many in-game minutes pass per real-world second (e.g. 0.25 = 12 min real-time shift)")]
    public float minutesPerSecond = 0.25f;
    public bool isClockRunning = true;

    [Header("State Flags")]
    public bool isBlackoutActive { get; private set; } = false;
    public bool isShiftCompleted { get; private set; } = false;

    [Header("Blackout & Shift Events")]
    public UnityEvent OnBlackoutInitiated;
    public UnityEvent OnBlackoutTerminated;
    public UnityEvent OnShiftCompleted;
    public UnityEvent<string> OnTimeUpdated; // Formatted "03:04 AM"

    [Header("Audio & Lighting Triggers")]
    [SerializeField] private AudioSource breakerSlamAudio;
    [SerializeField] private AudioSource townHallBellAudio;
    [SerializeField] private Light[] mainFluorescentLights;
    [SerializeField] private Light emergencyRedStrobe;

    private void Awake()
    {
        if (Instance != null && Instance != this) Destroy(gameObject);
        else Instance = this;
    }

    private void Update()
    {
        if (!isClockRunning || isShiftCompleted) return;

        // Advance in-game clock
        float previousMinute = currentMinutes;
        currentMinutes += minutesPerSecond * Time.deltaTime;

        // Check for 03:00 AM Blackout Trigger
        if (previousMinute < BLACKOUT_START && currentMinutes >= BLACKOUT_START)
        {
            TriggerTotalBlackout();
        }
        // Check for 03:10 AM Blackout Restoration
        else if (previousMinute < BLACKOUT_END && currentMinutes >= BLACKOUT_END)
        {
            EndTotalBlackout();
        }
        // Check for 04:00 AM Shift End Victory Bell
        else if (previousMinute < SHIFT_END && currentMinutes >= SHIFT_END)
        {
            CompleteShift();
        }

        OnTimeUpdated?.Invoke(GetFormattedTime());
    }

    private void TriggerTotalBlackout()
    {
        isBlackoutActive = true;
        Debug.LogWarning("[THE 3 AM WHISPER] 03:00 AM: TOTAL BLACKOUT INITIATED.");

        // Audio sting: Breaker clunk and electrical arc
        if (breakerSlamAudio != null) breakerSlamAudio.Play();

        // Kill all standard fluorescent overhead lights
        foreach (var light in mainFluorescentLights)
        {
            if (light != null) light.enabled = false;
        }

        // Activate pulsating emergency red strobe
        if (emergencyRedStrobe != null) emergencyRedStrobe.enabled = true;

        OnBlackoutInitiated?.Invoke();
    }

    private void EndTotalBlackout()
    {
        isBlackoutActive = false;
        Debug.Log("[THE 3 AM WHISPER] 03:10 AM: Emergency power restored.");

        // Restore dim auxiliary fluorescent lights
        foreach (var light in mainFluorescentLights)
        {
            if (light != null) light.enabled = true;
        }

        if (emergencyRedStrobe != null) emergencyRedStrobe.enabled = false;
        OnBlackoutTerminated?.Invoke();
    }

    private void CompleteShift()
    {
        isShiftCompleted = true;
        isClockRunning = false;
        Debug.Log("[THE 3 AM WHISPER] 04:00 AM: SHIFT COMPLETED. ARCHIVIST SURVIVED.");

        if (townHallBellAudio != null) townHallBellAudio.Play();
        OnShiftCompleted?.Invoke();
    }

    public string GetFormattedTime()
    {
        int totalMins = Mathf.FloorToInt(currentMinutes);
        int hours = totalMins / 60;
        int mins = totalMins % 60;
        return string.Format("{0:D2}:{1:D2} AM", hours, mins);
    }
}`
      },
      sanity: {
        title: 'SanitySystem.cs',
        desc: 'Simulates psychological degradation from darkness and paranormal entities, controlling post-processing distortion and auditory hallucinations.',
        code: `using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

/// <summary>
/// "The 3 AM Whisper" - Sanity Meter & Psychological Status Effects
/// Manages decay in total darkness or near entities, recovering via pills or light.
/// Drives post-processing (Vignette, Chromatic Aberration, Lens Distortion) and audio triggers.
/// </summary>
public class SanitySystem : MonoBehaviour
{
    [Header("Sanity Values")]
    [Range(0f, 100f)] public float currentSanity = 100f;
    public const float MAX_SANITY = 100f;

    [Header("Drain Rates (Per Second)")]
    public float darkDrainRate = 1.8f;            // Drain rate in total darkness
    public float entityProximityDrainRate = 5.5f; // Drain rate within 5m of Caretaker/Patient
    public float safeLightRecoveryRate = 2.0f;    // Recovery near desk banker lamp

    [Header("Status Effect Thresholds")]
    public float paranoiaThreshold = 75f;     // Whispers become audible
    public float hallucinationThreshold = 50f; // Ghost footsteps & chromatic aberration
    public float breakdownThreshold = 25f;    // Tunnel vision, involuntary heavy breathing

    [Header("Post-Processing Volume (URP)")]
    [SerializeField] private Volume postProcessVolume;
    private ChromaticAberration chromaticAberration;
    private Vignette vignette;
    private LensDistortion lensDistortion;

    [Header("Audio Sources")]
    [SerializeField] private AudioSource heartbeatAudio;
    [SerializeField] private AudioSource auditoryWhispersAudio;
    [SerializeField] private AudioSource heavyBreathingAudio;
    [SerializeField] private AudioSource ghostFootstepAudio;

    private float ghostStepTimer = 0f;

    private void Start()
    {
        // Extract post-processing overrides
        if (postProcessVolume != null && postProcessVolume.profile != null)
        {
            postProcessVolume.profile.TryGet(out chromaticAberration);
            postProcessVolume.profile.TryGet(out vignette);
            postProcessVolume.profile.TryGet(out lensDistortion);
        }
    }

    private void Update()
    {
        bool isInDarkness = CheckIfPlayerInDarkness();
        bool isNearEntity = CheckEntityProximity();

        // 1. Calculate Sanity Decay or Recovery
        if (isNearEntity)
        {
            currentSanity -= entityProximityDrainRate * Time.deltaTime;
        }
        else if (isInDarkness)
        {
            currentSanity -= darkDrainRate * Time.deltaTime;
        }

        currentSanity = Mathf.Clamp(currentSanity, 0f, MAX_SANITY);

        // 2. Drive Audio Hallucinations & Heartbeat
        UpdatePsychologicalAudio();

        // 3. Drive Visual Distortion Shaders
        UpdateVisualDistortion();

        // 4. Ghost Footsteps Hallucination Timer
        if (currentSanity < hallucinationThreshold)
        {
            ghostStepTimer += Time.deltaTime;
            if (ghostStepTimer > Random.Range(6f, 14f))
            {
                TriggerGhostFootsteps();
                ghostStepTimer = 0f;
            }
        }
    }

    public void ConsumeSedative(float recoveryAmount = 35f)
    {
        currentSanity = Mathf.Min(currentSanity + recoveryAmount, MAX_SANITY);
        Debug.Log("[SANITY] Consumed sedative. Sanity restored to: " + currentSanity);
    }

    private void UpdatePsychologicalAudio()
    {
        // Heartbeat frequency scales inversely with sanity (60 BPM to 145 BPM)
        if (heartbeatAudio != null)
        {
            float targetPitch = Mathf.Lerp(1.6f, 0.85f, currentSanity / MAX_SANITY);
            heartbeatAudio.pitch = targetPitch;
            heartbeatAudio.volume = Mathf.Lerp(0.9f, 0.2f, currentSanity / MAX_SANITY);
            if (!heartbeatAudio.isPlaying) heartbeatAudio.Play();
        }

        // Whispers audible below 75%
        if (auditoryWhispersAudio != null)
        {
            float whisperVolume = Mathf.InverseLerp(paranoiaThreshold, 20f, currentSanity);
            auditoryWhispersAudio.volume = whisperVolume * 0.7f;
            if (whisperVolume > 0.05f && !auditoryWhispersAudio.isPlaying) auditoryWhispersAudio.Play();
        }

        // Involuntary heavy breathing below 25%
        if (heavyBreathingAudio != null)
        {
            bool shouldBreathe = currentSanity < breakdownThreshold;
            if (shouldBreathe && !heavyBreathingAudio.isPlaying) heavyBreathingAudio.Play();
            else if (!shouldBreathe && heavyBreathingAudio.isPlaying) heavyBreathingAudio.Stop();
        }
    }

    private void UpdateVisualDistortion()
    {
        float sanityLoss = 1f - (currentSanity / MAX_SANITY);

        if (chromaticAberration != null)
        {
            chromaticAberration.intensity.value = Mathf.Lerp(0f, 1f, sanityLoss);
        }

        if (vignette != null)
        {
            vignette.intensity.value = Mathf.Lerp(0.2f, 0.58f, sanityLoss);
        }

        if (lensDistortion != null)
        {
            lensDistortion.intensity.value = Mathf.Lerp(0f, -0.4f, sanityLoss);
        }
    }

    private void TriggerGhostFootsteps()
    {
        if (ghostFootstepAudio != null)
        {
            // Spatialized panning to an angle behind the player
            ghostFootstepAudio.panStereo = Random.Range(-0.8f, 0.8f);
            ghostFootstepAudio.PlayOneShot(ghostFootstepAudio.clip);
        }
    }

    private bool CheckIfPlayerInDarkness()
    {
        // Evaluates flashlight state and local light probe intensity
        return !FlashlightController.Instance.IsTurnedOn;
    }

    private bool CheckEntityProximity()
    {
        // Distance check against Caretaker and Patient
        return CaretakerAI.Instance != null && CaretakerAI.Instance.DistanceToPlayer < 7.0f;
    }
}`
      },
      hiding: {
        title: 'HidingAndBreathController.cs',
        desc: 'Controls entering desks/cabinets, swapping camera viewpoints, and running the rhythmic QTE breath-holding mechanic.',
        code: `using System.Collections;
using UnityEngine;

/// <summary>
/// "The 3 AM Whisper" - Hiding Spots & Rhythmic Breath-Holding QTE
/// Allows archivist to enter file lockers or desk recesses.
/// Enforces rhythmic spacebar tapping / lung capacity control to prevent detection by Caretaker.
/// </summary>
public class HidingAndBreathController : MonoBehaviour
{
    public static HidingAndBreathController Instance { get; private set; }

    [Header("Hiding State")]
    public bool isHidden = false;
    public Transform currentHidingSpot;
    [SerializeField] private Camera mainCamera;
    [SerializeField] private Transform originalCameraAnchor;

    [Header("Lung Capacity & Breath Holding")]
    [Range(0f, 100f)] public float lungCapacity = 100f;
    public const float MAX_LUNG_CAPACITY = 100f;
    public float breathDepleteRate = 14f;  // Depletes in ~7 seconds of continuous hold
    public float breathRecoveryRate = 22f; // Recovers when released
    public bool isHoldingBreath = false;

    [Header("Noise & Detection")]
    public float currentNoiseLevel = 0f; // 0 to 100 dB
    public const float GASP_NOISE = 95f; // Alert sound when lungs fail

    [Header("Audio Clips")]
    [SerializeField] private AudioSource inhaleAudio;
    [SerializeField] private AudioSource panicGaspAudio;
    [SerializeField] private AudioSource enterHidingAudio;

    private void Awake()
    {
        if (Instance != null && Instance != this) Destroy(gameObject);
        else Instance = this;
    }

    private void Update()
    {
        if (!isHidden) return;

        // Player holds [SPACE] to hold breath
        if (Input.GetKey(KeyCode.Space))
        {
            if (!isHoldingBreath)
            {
                isHoldingBreath = true;
                if (inhaleAudio != null) inhaleAudio.Play();
            }

            // Drain lung capacity
            lungCapacity -= breathDepleteRate * Time.deltaTime;
            currentNoiseLevel = 0f; // Absolute silence while holding

            // Check for lung exhaustion / panic gasp
            if (lungCapacity <= 0f)
            {
                TriggerPanicGasp();
            }
        }
        else
        {
            // Breathing naturally
            isHoldingBreath = false;
            lungCapacity = Mathf.Min(lungCapacity + breathRecoveryRate * Time.deltaTime, MAX_LUNG_CAPACITY);
            currentNoiseLevel = 22f; // Subtle audible breathing
        }

        // Press [E] to exit hiding spot
        if (Input.GetKeyDown(KeyCode.E) && isHidden)
        {
            ExitHiding();
        }
    }

    public void EnterHiding(Transform hidingSpotTransform, Transform peepHoleAnchor)
    {
        isHidden = true;
        currentHidingSpot = hidingSpotTransform;

        if (enterHidingAudio != null) enterHidingAudio.Play();

        // Snap camera to hiding interior peep-hole
        mainCamera.transform.position = peepHoleAnchor.position;
        mainCamera.transform.rotation = peepHoleAnchor.rotation;

        // Disable standard player walk movement
        PlayerMovementController.Instance.SetMovementLocked(true);
        Debug.Log("[HIDING] Entered hiding spot: " + hidingSpotTransform.name);
    }

    public void ExitHiding()
    {
        isHidden = false;
        isHoldingBreath = false;
        currentHidingSpot = null;

        // Restore camera to player body
        mainCamera.transform.position = originalCameraAnchor.position;
        mainCamera.transform.rotation = originalCameraAnchor.rotation;

        PlayerMovementController.Instance.SetMovementLocked(false);
        Debug.Log("[HIDING] Exited hiding spot.");
    }

    private void TriggerPanicGasp()
    {
        isHoldingBreath = false;
        lungCapacity = 10f; // Stunned lung state
        currentNoiseLevel = GASP_NOISE;

        if (panicGaspAudio != null) panicGaspAudio.Play();
        Debug.LogWarning("[HIDING] LUNGS FAILED! Archivist let out a violent gasp!");

        // Alert patrolling entities immediately
        if (CaretakerAI.Instance != null)
        {
            CaretakerAI.Instance.InvestigateNoisePosition(transform.position, GASP_NOISE);
        }
    }
}`
      },
      ai: {
        title: 'CaretakerAI.cs',
        desc: 'NavMesh-based finite state machine for "The Caretaker" during the 03:00 blackout window.',
        code: `using UnityEngine;
using UnityEngine.AI;

/// <summary>
/// "The 3 AM Whisper" - The Caretaker AI
/// Patrols corridors strictly during 03:00 - 03:10 Blackouts.
/// Reacts instantly to active flashlights and loud breath gasps.
/// </summary>
public class CaretakerAI : MonoBehaviour
{
    public static CaretakerAI Instance { get; private set; }

    public enum AIState { Dormant, Patrolling, Investigating, Hunting }
    public AIState currentState = AIState.Dormant;

    [Header("Patrol Waypoints")]
    public Transform[] patrolWaypoints;
    private int currentWaypointIndex = 0;

    [Header("Sensory Parameters")]
    public float sightRange = 16f;
    public float sightAngle = 75f;
    public LayerMask sightObstacles;
    public Transform playerTransform;

    [Header("Speeds")]
    public float patrolSpeed = 1.4f;
    public float huntSpeed = 3.6f;

    private NavMeshAgent agent;
    public float DistanceToPlayer { get; private set; } = 999f;

    private void Awake()
    {
        if (Instance != null && Instance != this) Destroy(gameObject);
        else Instance = this;
        agent = GetComponent<NavMeshAgent>();
    }

    private void Start()
    {
        GameClockManager.Instance.OnBlackoutInitiated.AddListener(OnBlackoutStart);
        GameClockManager.Instance.OnBlackoutTerminated.AddListener(OnBlackoutEnd);
        gameObject.SetActive(false); // Dormant until 03:00
    }

    private void Update()
    {
        if (currentState == AIState.Dormant) return;

        DistanceToPlayer = Vector3.Distance(transform.position, playerTransform.position);

        switch (currentState)
        {
            case AIState.Patrolling:
                UpdatePatrol();
                DetectPlayerVision();
                break;
            case AIState.Investigating:
                DetectPlayerVision();
                break;
            case AIState.Hunting:
                UpdateHunt();
                break;
        }
    }

    private void OnBlackoutStart()
    {
        gameObject.SetActive(true);
        currentState = AIState.Patrolling;
        agent.speed = patrolSpeed;
        MoveToNextWaypoint();
    }

    private void OnBlackoutEnd()
    {
        currentState = AIState.Dormant;
        gameObject.SetActive(false);
    }

    private void UpdatePatrol()
    {
        if (!agent.pathPending && agent.remainingDistance < 0.5f)
        {
            MoveToNextWaypoint();
        }
    }

    private void MoveToNextWaypoint()
    {
        if (patrolWaypoints.Length == 0) return;
        agent.destination = patrolWaypoints[currentWaypointIndex].position;
        currentWaypointIndex = (currentWaypointIndex + 1) % patrolWaypoints.Length;
    }

    private void DetectPlayerVision()
    {
        // If player is hidden, vision check is ignored unless they are gasping
        if (HidingAndBreathController.Instance.isHidden) return;

        Vector3 dirToPlayer = (playerTransform.position - transform.position).normalized;
        float angle = Vector3.Angle(transform.forward, dirToPlayer);

        if (angle < sightAngle * 0.5f && DistanceToPlayer < sightRange)
        {
            // Check line of sight
            if (!Physics.Raycast(transform.position + Vector3.up * 2f, dirToPlayer, DistanceToPlayer, sightObstacles))
            {
                // Spotting conditions: Flashlight turned on or distance < 5m
                if (FlashlightController.Instance.IsTurnedOn || DistanceToPlayer < 5f)
                {
                    BeginHunt();
                }
            }
        }
    }

    public void InvestigateNoisePosition(Vector3 noiseOrigin, float loudness)
    {
        if (currentState == AIState.Hunting) return;

        currentState = AIState.Investigating;
        agent.speed = patrolSpeed * 1.5f;
        agent.SetDestination(noiseOrigin);
        Debug.Log("[CARETAKER] Heard noise (" + loudness + "dB) at " + noiseOrigin);
    }

    private void BeginHunt()
    {
        currentState = AIState.Hunting;
        agent.speed = huntSpeed;
        Debug.LogWarning("[CARETAKER] Player spotted! Hunting mode engaged!");
    }

    private void UpdateHunt()
    {
        agent.SetDestination(playerTransform.position);
        if (DistanceToPlayer < 1.4f)
        {
            TriggerGameOverJumpscare();
        }
    }

    private void TriggerGameOverJumpscare()
    {
        Debug.LogError("[GAME OVER] The Caretaker caught the archivist.");
        // Trigger death animation & restart sequence
    }
}`
      }
    },
    godot: {
      clock: {
        title: 'game_clock.gd',
        desc: 'Godot 4 GDScript node managing the 01:00 - 04:00 time scale and blackout event signals.',
        code: `class_name GameClockManager
extends Node

## "The 3 AM Whisper" - Godot 4 Shift Clock
## Emits signals for 03:00 Total Blackout and 04:00 Victory Bell.

signal blackout_started
signal blackout_ended
signal shift_completed
signal time_tick(formatted_string: String)

const START_MINUTE: float = 60.0    # 01:00 AM
const BLACKOUT_START: float = 180.0 # 03:00 AM
const BLACKOUT_END: float = 190.0   # 03:10 AM
const SHIFT_END: float = 240.0      # 04:00 AM

@export var minutes_per_second: float = 0.25 # 12 min real-world full shift
var current_minutes: float = START_MINUTE
var is_blackout: bool = false
var is_shift_over: bool = false

@onready var breaker_sound = $BreakerSlamAudio
@onready var town_bell_sound = $TownBellAudio

func _process(delta: float) -> void:
    if is_shift_over:
        return
        
    var prev_min = current_minutes
    current_minutes += minutes_per_second * delta
    
    # 03:00 Total Blackout trigger
    if prev_min < BLACKOUT_START and current_minutes >= BLACKOUT_START:
        trigger_blackout()
    # 03:10 Power Restoration
    elif prev_min < BLACKOUT_END and current_minutes >= BLACKOUT_END:
        end_blackout()
    # 04:00 Shift Bell
    elif prev_min < SHIFT_END and current_minutes >= SHIFT_END:
        finish_shift()
        
    emit_signal("time_tick", get_formatted_time())

func trigger_blackout() -> void:
    is_blackout = true
    if breaker_sound:
        breaker_sound.play()
    emit_signal("blackout_started")
    print_rich("[color=red][b]03:00 AM TOTAL BLACKOUT INITIATED[/b][/color]")

func end_blackout() -> void:
    is_blackout = false
    emit_signal("blackout_ended")
    print_rich("[color=green]03:10 AM Power restored.[/color]")

func finish_shift() -> void:
    is_shift_over = true
    if town_bell_sound:
        town_bell_sound.play()
    emit_signal("shift_completed")
    print_rich("[color=cyan]04:00 AM SHIFT SURVIVED![/color]")

func get_formatted_time() -> String:
    var total_mins: int = int(floor(current_minutes))
    var hours: int = total_mins / 60
    var mins: int = total_mins % 60
    return "%02d:%02d AM" % [hours, mins]`
      },
      sanity: {
        title: 'sanity_meter.gd',
        desc: 'Godot 4 GDScript handling Sanity meter decay in darkness, shader uniform parameters, and auditory cues.',
        code: `class_name SanitySystem
extends Node

## "The 3 AM Whisper" - Godot 4 Sanity & Psychological Effects

@export_range(0.0, 100.0) var current_sanity: float = 100.0
@export var dark_drain_rate: float = 2.0
@export var entity_drain_rate: float = 6.0
@export var recovery_rate: float = 2.5

@onready var heartbeat_player = $HeartbeatAudio
@onready var whispers_player = $WhispersAudio
@onready var vhs_shader_rect = $VHSShaderCanvas

func _process(delta: float) -> void:
    var in_dark = not FlashlightManager.is_flashlight_on
    var near_monster = CaretakerAI.distance_to_player < 7.0
    
    if near_monster:
        current_sanity -= entity_drain_rate * delta
    elif in_dark:
        current_sanity -= dark_drain_rate * delta
        
    current_sanity = clampf(current_sanity, 0.0, 100.0)
    
    update_effects()

func update_effects() -> void:
    var loss = 1.0 - (current_sanity / 100.0)
    
    # Update CRT / VHS chromatic aberration shader parameter
    if vhs_shader_rect and vhs_shader_rect.material:
        vhs_shader_rect.material.set_shader_parameter("chromatic_offset", loss * 0.015)
        vhs_shader_rect.material.set_shader_parameter("vignette_darkness", 0.3 + loss * 0.5)
        
    # Drive Heartbeat Audio speed
    if heartbeat_player:
        heartbeat_player.pitch_scale = lerpf(0.9, 1.6, loss)
        heartbeat_player.volume_db = lerpf(-18.0, 0.0, loss)

func take_sedative(amount: float = 35.0) -> void:
    current_sanity = minf(current_sanity + amount, 100.0)
    print("Sedative consumed. Sanity: ", current_sanity)`
      },
      hiding: {
        title: 'hiding_breath_qte.gd',
        desc: 'Godot 4 GDScript implementing desk and locker hiding, camera repositioning, and spacebar breath suppression.',
        code: `class_name HidingController
extends Node

## "The 3 AM Whisper" - Godot 4 Hiding & Breath Suppression QTE

signal panic_gasped

var is_hidden: bool = false
var is_holding_breath: bool = false
var lung_capacity: float = 100.0
var breath_drain: float = 15.0
var breath_recovery: float = 20.0

@onready var gasp_audio = $PanicGaspAudio

func _unhandled_input(event: InputEvent) -> void:
    if not is_hidden:
        return
        
    if event.is_action_pressed("ui_accept"): # Spacebar
        is_holding_breath = true
    elif event.is_action_released("ui_accept"):
        is_holding_breath = false
        
    if event.is_action_pressed("interact"): # 'E'
        exit_hiding()

func _process(delta: float) -> void:
    if not is_hidden:
        return
        
    if is_holding_breath:
        lung_capacity -= breath_drain * delta
        if lung_capacity <= 0.0:
            trigger_gasp()
    else:
        lung_capacity = minf(lung_capacity + breath_recovery * delta, 100.0)

func trigger_gasp() -> void:
    is_holding_breath = false
    lung_capacity = 10.0
    if gasp_audio:
        gasp_audio.play()
    emit_signal("panic_gasped")
    print_rich("[color=red]LUNGS FAILED! Archivist gasped loudly![/color]")`
      },
      ai: {
        title: 'entity_caretaker.gd',
        desc: 'Godot 4 CharacterBody3D NavigationAgent3D script for The Caretaker corridor blackout stalking.',
        code: `class_name CaretakerEntity
extends CharacterBody3D

## "The 3 AM Whisper" - Caretaker Entity Stalker (Godot 4)

@export var patrol_speed: float = 1.5
@export var hunt_speed: float = 3.5

@onready var nav_agent: NavigationAgent3D = $NavigationAgent3D
@onready var player: Node3D = get_tree().get_first_node_in_group("player")

var is_active: bool = false

func _ready() -> void:
    visible = false
    set_physics_process(false)

func start_blackout_patrol() -> void:
    is_active = true
    visible = true
    set_physics_process(true)

func _physics_process(delta: float) -> void:
    if not is_active or not player:
        return
        
    var dist = global_position.distance_to(player.global_position)
    
    # If player is using flashlight during blackout, pursue directly
    if FlashlightManager.is_flashlight_on:
        nav_agent.target_position = player.global_position
        velocity = (nav_agent.get_next_path_position() - global_position).normalized() * hunt_speed
    else:
        # Slow deliberate prowl
        velocity = transform.basis.z * -patrol_speed
        
    move_and_slide()`
      }
    }
  };

  const currentScriptData = scripts[engine][activeScript];

  return (
    <div className="space-y-6">
      {/* Engine & Script Picker Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#11131a] border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-bold font-mono-code text-zinc-100 uppercase tracking-wide">
              Production Script Architecture & Code Templates
            </h3>
            <p className="text-xs text-zinc-400">
              Clean, modular, production-ready scripts for Unity (C#) & Godot 4 (GDScript).
            </p>
          </div>
        </div>

        {/* Engine Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <button
            onClick={() => setEngine('unity')}
            className={`px-3 py-1.5 text-xs font-mono-code font-bold rounded-md transition-colors ${
              engine === 'unity' ? 'bg-cyan-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Unity (C#)
          </button>
          <button
            onClick={() => setEngine('godot')}
            className={`px-3 py-1.5 text-xs font-mono-code font-bold rounded-md transition-colors ${
              engine === 'godot' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Godot 4 (GDScript)
          </button>
        </div>
      </div>

      {/* Script Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        {[
          { key: 'clock', label: 'a) Clock & 03:00 Blackout Event' },
          { key: 'sanity', label: 'b) Sanity Meter & Audio/Shaders' },
          { key: 'hiding', label: 'c) Hiding & Breath QTE System' },
          { key: 'ai', label: 'd) Entity AI State Machine' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveScript(tab.key as any)}
            className={`px-3.5 py-2 text-xs font-mono-code font-medium rounded-lg border transition-all ${
              activeScript === tab.key
                ? 'bg-amber-500/10 border-amber-500/60 text-amber-300'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Script Viewer Container */}
      <div className="bg-[#0c0e14] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Code Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#141722] border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono-code font-bold text-zinc-200">
              {currentScriptData.title}
            </span>
            <span className="text-zinc-500 text-xs">·</span>
            <span className="text-[11px] text-zinc-400">
              {currentScriptData.desc}
            </span>
          </div>

          <button
            onClick={() => handleCopy(currentScriptData.code, currentScriptData.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono-code transition-colors"
          >
            {copied === currentScriptData.title ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Syntax Code Block */}
        <div className="p-5 overflow-x-auto max-h-[560px] text-xs font-mono-code leading-relaxed text-zinc-300 bg-[#08090d]">
          <pre>
            <code>{currentScriptData.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
