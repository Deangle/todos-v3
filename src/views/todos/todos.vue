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
            v-model:value="state.todo"
          ></a-input>
        </a-layout-header>
        <a-layout-content v-if="state.todoList.length">
          <a-checkbox
            id="check-all"
            @change="onCheckAllChange"
            v-model:checked="state.checkAll"
            v-if="state.todoList.length"
          >
            <span></span>
          </a-checkbox>
          <a-card v-for="(item, index) in fileterTodoList" :key="index">
            <a-checkbox
              v-model:checked="item.done"
              @change="onChange(index)"
            ></a-checkbox>
            <div v-if="!item.editing" @dblclick="edit(item)">
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
        <a-layout-footer v-if="state.todoList.length">
          <div class="left">
            <span>{{ todos.length }} item left</span>
          </div>
          <div class="middle">
            <ul>
              <li
                :class="{ selected: state.selected === 'all' }"
                @click="selectList('all')"
              >
                All
              </li>
              <li
                :class="{ selected: state.selected === 'active' }"
                @click="selectList('active')"
              >
                Active
              </li>
              <li
                :class="{ selected: state.selected === 'completed' }"
                @click="selectList('completed')"
              >
                Completed
              </li>
            </ul>
          </div>
          <div class="right">
            <span v-if="dones.length" @click="clearCompleted"
              >Clear completed</span
            >
          </div>
        </a-layout-footer>
      </a-layout>
    </div>
  </div>
</template>

<script>
import { reactive, watch, onMounted, nextTick, computed } from 'vue';
import './todos.css';

export default {
  setup() {
    const time = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
    const state = reactive({
      todoList: JSON.parse(localStorage.getItem('todoList')) || [],
      todo: '',
      checkAll: false,
      selected: 'all',
    });

    // todoList 分类
    const todoList = {
      all(todoList) {
        return todoList;
      },
      active(todoList) {
        return todoList.filter((item) => !item.done);
      },
      completed(todoList) {
        return todoList.filter((item) => item.done);
      },
    };

    // 添加
    const addTodo = (e) => {
      if (!state.todo) return;
      state.todoList.push({
        id: +new Date(),
        done: false,
        time: time,
        content: state.todo,
      });
      state.todo = '';
    };

    // 全选
    const onCheckAllChange = () => {
      state.todoList.forEach((item) => {
        item.done = state.checkAll;
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
    };

    // 编辑
    const edit = (item) => {
      item.editing = true;
    };

    // 编辑确认
    const editSure = (item) => {
      item.editing = false;
    };

    // 计算待办列表
    const todos = computed(() => {
      return state.todoList.filter((item) => !item.done);
    });

    // 计算已办列表
    const dones = computed(() => {
      return state.todoList.filter((item) => item.done);
    });

    // 清空已办列表
    const clearCompleted = () => {
      state.todoList = state.todoList.filter((item) => !item.done);
    };

    // 选择分类：全部、待办、已办
    const selectList = (type) => {
      state.selected = type;
    };

    // 通过计算属性，计算 todoList 列表在不同分类下数据展示的不同
    const fileterTodoList = computed(() => {
      return todoList[state.selected](state.todoList);
    });

    // 监听 todoList，单选时控制全选是否勾选
    watch(state.todoList, (list) => {
      let count = 0;
      list.forEach((item) => {
        if (item.done) count++;
      });

      state.checkAll = count === list.length;
      // 只要 todoList 有更改，就存入 localStorage
      localStorage.setItem('todoList', JSON.stringify(state.todoList));
    });

    return {
      state,
      addTodo,
      onCheckAllChange,
      onChange,
      destroy,
      edit,
      editSure,
      todos,
      dones,
      clearCompleted,
      selectList,
      todoList,
      fileterTodoList,
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
