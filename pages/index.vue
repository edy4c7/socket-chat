<script>
export default {
  middleware ({ route, redirect }) {
    if (route.path === '/') {
      redirect('/join')
    }
  }
}
</script>
