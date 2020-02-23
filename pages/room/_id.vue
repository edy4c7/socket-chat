<template>
  <div>
    <form @submit.prevent="send" action="">
      <input id="message" v-model="message" type="text" name="message">
      <button :disabled="!isJoined" type="submit">
        send
      </button>
      <ul>
        <li v-for="(m, i) in messages" :key="i">
          {{ m }}
        </li>
      </ul>
    </form>
    <input v-model="url" type="text" readonly>
    <form @submit.prevent="leave" action="">
      <button>leave</button>
    </form>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
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
    /* eslint no-unused-vars: 0 */
    this.socket.on('joined', () => {
      this.isJoined = true
    })
    this.socket.on('incoming', (param) => {
      this.messages.push(param.message)
    })
  },
  methods: {
    send () {
      this.socket.emit('send', {
        message: this.message
      })
      this.message = ''
    },
    leave () {
    }
  }
}

</script>
