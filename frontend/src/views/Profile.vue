<script setup>
import { ref } from 'vue'
import { profileState } from '../store'

const profile = profileState

const saved = ref(false)

const save = () => {
  saved.value = true
  setTimeout(() => saved.value = false, 2500)
}
</script>

<template>
  <div>
    <!-- Header Banner -->
    <div style="
      background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 24px;
    ">
      <div style="
        width: 80px; height: 80px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 2rem; font-weight: 700;
        box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        flex-shrink: 0;
      ">{{ profile.fullName.split(' ').map(n => n[0]).join('') }}</div>
      <div>
        <div style="font-size: 1.5rem; font-weight: 700;">{{ profile.fullName }}</div>
        <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">{{ profile.email }}</div>
        <div style="
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px; padding: 5px 12px;
          background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.25);
          border-radius: 20px; font-size: 0.75rem; font-weight: 600; color: #34d399;
        ">
          <span class="material-symbols-rounded" style="font-size:14px;">verified</span>
          Personal Account
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div class="add-form-card">
      <div class="form-title">
        <span class="material-symbols-rounded title-icon">manage_accounts</span>
        Edit Profile Information
      </div>

      <form @submit.prevent="save">
        <div class="form-row">
          <div class="form-col">
            <div class="form-field">
              <label>Full Name</label>
              <input v-model="profile.fullName" type="text" placeholder="Your full name" />
            </div>
            <div class="form-field">
              <label>Email Address</label>
              <input v-model="profile.email" type="email" placeholder="you@example.com" />
            </div>
            <div class="form-field">
              <label>Phone Number</label>
              <input v-model="profile.phone" type="text" placeholder="+1 234 567 8900" />
            </div>
          </div>
          <div class="form-col">
            <div class="form-field">
              <label>Occupation</label>
              <input v-model="profile.occupation" type="text" placeholder="Your occupation" />
            </div>
            <div class="form-field">
              <label>Bio</label>
              <textarea v-model="profile.bio" rows="4" placeholder="Tell us something about yourself..." style="resize:vertical; width:100%"></textarea>
            </div>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <button type="submit" class="btn-save">
            <span class="material-symbols-rounded" style="font-size:18px; vertical-align:middle; margin-right:6px;">save</span>
            Save Changes
          </button>
          <span v-if="saved" style="margin-left: 16px; color: var(--success-light); font-size: 0.88rem; font-weight: 500;">
            <span class="material-symbols-rounded" style="font-size:16px; vertical-align:middle;">check_circle</span>
            Profile saved!
          </span>
        </div>
      </form>
    </div>

    <!-- Info note -->
    <div style="
      padding: 16px 20px;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.15);
      border-radius: 12px;
      font-size: 0.82rem;
      color: var(--text-muted);
      display: flex; align-items: flex-start; gap: 10px;
    ">
      <span class="material-symbols-rounded" style="color: var(--accent-light); font-size:18px; flex-shrink:0;">info</span>
      <span>Profile changes are currently local only. In Stage 7 (Authentication), this data will be synced to your backend database with a secure JWT-protected API.</span>
    </div>
  </div>
</template>
