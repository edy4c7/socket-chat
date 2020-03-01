<template>
  <div class="container">
    <form @submit.prevent="send" action="">
      <b-field label="Message">
        <b-input v-model="message" />
      </b-field>
      <b-button :disabled="!isJoined" type="is-primary" native-type="submit">
        send
      </b-button>
    </form>
    <ul>
      <li v-for="(m, i) in messages" :key="i">
        {{ m.text }}
      </li>
    </ul>
    <b-field label="URL for join">
      <b-input v-model="url" readonly />
    </b-field>
    <form @submit.prevent="leave" action="">
      <b-button native-type="submit">
        leave
      </b-button>
    </form>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  middleware ({ store, redirect, params }) {
    const rooms = store.state.auth.user.rooms || []
    if (!rooms.includes(params.id)) {
      redirect({ path: `/join?roomId=${params.id}` })
    }
  },
  data () {
    return {
      isJoined: false,
      message: '',
      messages: [],
      socket: io({
        query: {
          roomId: this.$route.params.id
        }
      })
    }
  },
  computed: {
    url () {
      return `${process.env.baseUrl}/join?roomId=${this.$route.params.id}`
    }
  },
  mounted () {
    this.socket.on('connect', (param) => {
      this.isJoined = true
      this.$axios.$get(`/api/room/${this.$route.params.id}`)
        .then((res) => {
          this.messages = res
        })
    })
    this.socket.on('error', () => {
      alert('socket connection error')
      this.$router.replace({ path: `/join` })
    })
    this.socket.on('incoming', (param) => {
      this.messages.push(param)
    })
  },
  methods: {
    send () {
      this.socket.emit('send', {
        message: this.message
      })
      this.message = ''
    },
    async leave () {
      await this.$auth.logout({
        data: {
          roomId: this.$route.params.id
        }
      })
    }
  }
}

</script>
