<template>
  <div class="container">
    <form @submit.prevent="join">
      <b-field label="Room ID">
        <b-input v-model="roomId" />
      </b-field>
      <b-field label="Password">
        <b-input v-model="password" type="password" />
      </b-field>
      <b-button type="is-primary" native-type="submit">
        Join
      </b-button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roomId: this.$route.query.roomId || '',
      password: ''
    }
  },
  methods: {
    async join () {
      try {
        await this.$auth.loginWith('local', {
          data: {
            roomId: this.roomId,
            password: this.password
          }
        })
        this.$router.replace({ path: `/room/${this.roomId}` })
      } catch (err) {
        // eslint-disable-next-line
        console.error(err)
      }
    }
  }
}
</script>
