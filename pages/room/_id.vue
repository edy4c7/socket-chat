<template>
  <form action="">
    <input id="message" type="text" name="message">
    <button type="submit">
      send
    </button>
  </form>
</template>

<script>
import io from 'socket.io-client'

export default {
  mounted () {
    /* eslint no-unused-vars: 1 */
    const socket = io()
  }
}

</script>
