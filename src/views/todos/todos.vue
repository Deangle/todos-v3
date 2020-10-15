<template>
  <div>
    <h1 id="title">todos</h1>
    <div>
      <a-layout id="todo-list">
        <a-layout-header>
          <a-input
            id="input"
            placeholder="What needs to be done?"
            @keyup.enter="addTodo"
            v-model:value="todo"
          ></a-input>
        </a-layout-header>
        <a-layout-content v-if="state.todoList.length">
          <a-checkbox
            id="check-all"
            @change="onCheckAllChange"
            v-model:checked="checkAll"
            v-if="state.todoList.length"
          >
            <span></span>
          </a-checkbox>
          <a-card
            v-for="(item, index) in state.todoList"
            :key="index"
            @dblclick="edit(item)"
          >
            <a-checkbox
              v-model:checked="item.done"
              @change="onChange(index)"
            ></a-checkbox>
            <div v-if="!item.editing">
              <span class="time" :class="{ completed: item.done }">
                {{ item.time }}
              </span>
              <p class="text" :class="{ completed: item.done }">
                {{ item.content }}
              </p>
            </div>
            <a-input
              class="edit-ipt"
              v-model:value="item.content"
              v-else
              @blur="editSure(item)"
              @keyup.enter="editSure(item)"
              v-focus="item.editing"
            ></a-input>
            <span class="destroy" @click="destroy(item)"></span>
          </a-card>
        </a-layout-content>
      </a-layout>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, nextTick } from 'vue';
import './todos.css';

export default {
  setup() {
    let checkAll = ref(false);
    let todo = ref('');
    let edting = ref(false);
    const time = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    const state = reactive({
      todoList: JSON.parse(localStorage.getItem('todoList')) || [],
    });

    // 添加
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

    // 删除
    const destroy = (item) => {
      state.todoList.splice(state.todoList.indexOf(item), 1);
      localStorage.setItem('todoList', JSON.stringify(state.todoList));
    };

    // 编辑
    const edit = (item) => {
      item.editing = true;
    };

    // 编辑确认
    const editSure = (item) => {
      item.editing = false;
    };

    // 监听 todoList，单选时控制全选是否勾选
    watch(state.todoList, (list) => {
      let count = 0;
      list.forEach((item) => {
        if (item.done) count++;
      });

      checkAll.value = count === list.length;
    });

    return {
      state,
      todo,
      addTodo,
      checkAll,
      onCheckAllChange,
      onChange,
      destroy,
      edit,
      editSure,
    };
  },
  directives: {
    focus: {
      // 指令的定义
      mounted(el) {
        el.focus();
      },
    },
  },
};
</script>
