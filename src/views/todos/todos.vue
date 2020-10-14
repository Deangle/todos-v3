<template>
  <div>
    <h1 id="title">todos</h1>
    <div>
      <a-layout id="todo-list">
        <a-layout-header>
          <a-checkbox
            id="check-all"
            @change="onCheckAllChange"
            v-model:checked="checkAll"
            v-if="state.todoList.length"
          ></a-checkbox>
          <a-input
            id="input"
            placeholder="What needs to be done?"
            @keyup.enter="addTodo"
            v-model:value="todo"
          ></a-input>
        </a-layout-header>
        <a-layout-content v-if="state.todoList.length">
          <a-card v-for="(item, index) in state.todoList" :key="index">
            <a-checkbox
              v-model:checked="item.done"
              @change="onChange(index)"
            ></a-checkbox>
            <div>
              <span class="time" :class="{ completed: item.done }">
                {{ item.time }}
              </span>
              <p class="text" :class="{ completed: item.done }">
                {{ item.content }}
              </p>
            </div>
          </a-card>
        </a-layout-content>
      </a-layout>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue';
import './todos.css';

export default {
  setup() {
    let checkAll = ref(false);
    let todo = ref('');
    const time = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    const state = reactive({
      todoList: [],
    });

    // 添加待办事项
    const addTodo = (e) => {
      if (!todo.value) return;
      state.todoList.push({
        id: +new Date(),
        done: false,
        time: time,
        content: todo.value,
      });
      localStorage.setItem('todoList', JSON.stringify(state.todoList));

      todo.value = '';
    };

    // 全选
    const onCheckAllChange = () => {
      state.todoList.forEach((item) => {
        item.done = !item.done;
        checkAll.value = !checkAll.value;
      });
    };

    // 单选
    const onChange = (index) => {
      let done = state.todoList[index].done;
      done = !done;
    };

    // 监听 todoList，单选时控制全选是否勾选
    watch(state.todoList, (list) => {
      let count = 0;
      list.forEach((item) => {
        if (item.done) count++;
      });

      checkAll.value = count === list.length;
    });

    onMounted(() => {
      if(localStorage.getItem('todoList')) {
        state.todoList = JSON.parse(localStorage.getItem('todoList'))
      }
    })
    return {
      state,
      todo,
      addTodo,
      checkAll,
      onCheckAllChange,
      onChange,
    };
  },
};
</script>
