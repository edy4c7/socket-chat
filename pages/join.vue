<template>
  <div>
    <form @submit.prevent="join" method="post">
      <label for="roomId">roomId</label>
      <input v-model="roomId" name="roomId" type="text">
      <label for="password">password</label>
      <input v-model="password" name="password" type="password">
      <button type="submit">
        Join
      </button>
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
