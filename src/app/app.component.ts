import { R3TargetBinder } from '@angular/compiler';
import { Component } from '@angular/core';

const todos = [
  { id: 1, title: '吃饭', done: true },
{ id: 2, title: '吃饭', done: false },
  { id: 3, title: '吃饭', done: true }
]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zxtodo';
  public todos: {
    id: number,
    title: string,
    done:boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || "[]")
  public currentEditing: {
    id: number,
    title: string,
    done:boolean
  } = null

  public visibility: string = 'all'

//ngOnInit 在初始化的时候执行一次，可以在这里拿到组件类实例，
// 从而访问修改组件类实例当中的成员
// 该函数是一个特殊的angular生命周期钩子函数 它会在Angular应用初始化的时候执行一次
  ngOnInit() {
    console.log(this.visibility);
    this.hashchangeHandler() 
    // 通过bind 让this指向实例组件  否则this指向window
    window.onhashchange =  this.hashchangeHandler.bind(this)
}

  // 当Angular组件数据发生改变的时候，ngDoCheck钩子会被触发
  // 我们要做的就是在这个钩子函数中去持久化存储我们的todos数据
  ngDoCheck() {
    // console.log('ngDoCheck');
    // 本地存储就是刷新不会消失
    window.localStorage.setItem('todos',JSON.stringify(this.todos))
}
  
  
  // ----重点说明：如果对一个属性使用get访问器，就不需要定义该属性了----
  get filterTodos() {
    if (this.visibility === 'all') {
    return this.todos
    } else if(this.visibility==='active'){
    return this.todos.filter(t=>!t.done)
    } else if (this.visibility==='completed') {
      return this.todos.filter(t=>t.done)
  }
}

  
  // 实现导航切换数据过滤的功能
  // 1.提供一个属性，该属性会根据当前点击的链接返回过滤之后的数据
  // filterTodos
  // 2.提供一个属性，用来存储当前点击的链接标识
  // visibility 字符串
  // all active completed
  // 3.为链接添加点击事件，当点击导航链接时候，改变
  addTodo(e): void{
    const titleText = e.target.value
    if (!titleText.length) {
      return
    }
    // 用最后一项的id减去1，不是用总长度减1
    const last =this.todos[this.todos.length - 1]  
    this.todos.push({ id: last?last.id+1:1, title: titleText, done: false })
    e.target.value=''
    // console.log(this.todos);
  }
  // 利用属性的get和set  赋值调用set  访问调用get 
  //  其实属性本身不存储任何值的，这个相当于带了两个方法 不过用的时候不要当做方法来调，当做属性来调
  // 底下的全选，则上面的选中  
  get toggleAll() {
    return this.todos.every(t=>t.done)
  }
  // 这个是属性，不是方法. 所以把它设置为input复选框的值就可以了
  // 通过change 来触发toggleAll的set方法 set就能接收到html中赋的值，例如
  //   为true，则val就是true  这时遍历所有当前任务项，让val为赋的这个值
  // 上面的选中，则下面的全选  上面的不选中，则下面的都不选
  set toggleAll(val) {
    this.todos.forEach(t=>t.done=val)
  }
  //splice 数组方法 删除这个索引
  removeTodo(index:number) {
    this.todos.splice(index,1)
  }
  saveEdit(todo, e) {
    // 它这是一个组件，不用传值的，可以直接这样写，html会拿到的
    todo.title=e.target.value
    this.currentEditing=null
    
  }
  // 取消编辑状态
  handleEditKeyUp(e) {
    // console.log(e.keyCode);
    // 解构赋值
    const {keyCode,target} = e
    if (keyCode === 27) {
      target.value = this.currentEditing.title
      this.currentEditing = null
    }
  }
  // get访问器属性   显示所有未完成的
  get remaningCount() {
    return this.todos.filter(t=>!t.done).length
  }
// 调用这个方法
  hashchangeHandler() {
    console.log(this);
    
      // 当用户点击了锚点的时候，我们需要获取当前的锚点标识
      // 然后动态的将根组件中的visibility设置为当前点击的锚点标识
      // console.log('获取了面对');
      // console.log(this.visibility);
      const hash = window.location.hash.substr(1)
      console.log(hash);
      // zx  根据a链接的点击 跳转不同的地址  造成hash变化 然后给visibility重新赋值
      // 再通过这个值 进行数据过滤
      switch (hash) {
        case '/':
           this.visibility = 'all'
          break;
        case '/active':
            this.visibility = 'active'
          break;
        case '/completed':
            this.visibility = 'completed'
            break;
      }
  }
  // 清除所有已完成的
  clearAllDone() {
    this.todos=this.todos.filter(t=>!t.done)
  }

}
// // 函数写在class之外的话 ，this.数据是拿不到的，所以不能写在这里
// // 可以写在组件的生命钩子中
// window.onhashchange = function () {
//   // 当用户点击了锚点的时候，我们需要获取当前的锚点标识
//   // 然后动态的将根组件中的visibility设置为当前点击的锚点标识
//   console.log('获取了面对');
//   console.log(this.visibility);
  
// }


