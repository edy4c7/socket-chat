<template>
  <div class="container">
    <form @submit.prevent="create">
      <b-field label="Password">
        <b-input v-model="password" type="password" />
      </b-field>
      <b-button type="is-primary" native-type="submit">
        create
      </b-button>
    </form>
  </div>
</template>

<script>
export default {
  auth: false,
  data () {
    return {
      password: ''
    }
  },
  methods: {
    async create () {
      try {
        const res = await this.$axios.$post('/api/room', {
          password: this.password
        })
        await this.$auth.fetchUser()
        this.$router.replace({ path: `/room/${res.roomId}` })
      } catch (err) {
        // eslint-disable-next-line
        console.error(err)
      }
    }
  }
}
</script>
