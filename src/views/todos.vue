<template>
  <div>
    <h1 id="title">todos</h1>
    <div>
      <div id="todo-list">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TodoList'
}
</script>

<style>
  #todo-list {
    width: 550px;
    min-height: 250px;
    margin: auto;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  #title {
    color: royalblue;
    font-size: 80px;
  }
</style>