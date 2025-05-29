var running=false;
const checkboxes=document.querySelectorAll('.singlecheck');
var del;
document.addEventListener("mousedown",e=>{
    if(e.button===2) rightclick=true;
    else rightclick=false;
});
checkboxes.forEach(cb=>{
    cb.addEventListener('change',()=>{
        if(cb.checked) checkboxes.forEach(other=>{ if(other!==cb) other.checked=false; });
    });
});
var start;
startlis=[];
endlis=[];
var end;
var map=[];
var board=document.getElementById("board");
for(let i=0;i<30;i++){
    let row=document.createElement("div");
    row.className="rows";
    let lis=[];
    for(let j=0;j<60;j++){
        let cell=document.createElement("button");
        cell.className="cells";
        cell.id=`${i}-${j}`;
        cell.onclick=()=>clickedbtn(i,j);
        row.appendChild(cell);
        lis.push('.');
    }
    map.push(lis);
    board.appendChild(row);
}
function checkbox(){
    if(running) return null;
    const cbs=document.querySelectorAll('.singlecheck');
    let selected=null;
    cbs.forEach(cb=>{ if(cb.checked) selected=cb; });
    return selected?selected.value:null;
}
function clickedbtn(i,j){
    if(running) return;
    let selected=checkbox();
    if(selected==null) return;
    let key=`${i}-${j}`;
    if(selected=="start"){
        if(start!=null){
            let prev=document.getElementById(start);
            if(prev) prev.style.backgroundColor="white";
            map[startlis[0]][startlis[1]]='.';
        }
        start=key;
        startlis=[i,j];
        let cell=document.getElementById(key);
        if(cell) cell.style.backgroundColor="green";
        map[i][j]='s';
    }
    else if(selected=="end"){
        if(end!=null){
            let prev=document.getElementById(end);
            if(prev) prev.style.backgroundColor="white";
            map[endlis[0]][endlis[1]]='.';
        }
        end=key;
        endlis=[i,j];
        let cell=document.getElementById(key);
        if(cell) cell.style.backgroundColor="red";
        map[i][j]='e';
    }
    else if(selected=="wall"){
        if(key==start){ start=null; startlis=[]; }
        else if(key==end){ end=null; endlis=[]; }
        let cell=document.getElementById(key);
        if(cell) cell.style.backgroundColor="black";
        map[i][j]='w';
    }
    else if(selected=="clear"){
        if(key==start){ start=null; startlis=[]; }
        else if(key==end){ end=null; endlis=[]; }
        let cell=document.getElementById(key);
        if(cell) cell.style.backgroundColor="white";
        map[i][j]='.';
    }
}
function solve(){
    if(running) return;
    clearslv();
    if(start==null||end==null) return;
    running=true;
    let algorithm=document.getElementById("algorithm");
    if(algorithm.value=="bfs") fs(startlis,endlis);
    else if(algorithm.value=="dfs") fs(startlis,endlis,true);
    running=false;
}
function getNeighbours(i,j){
    let neighbours=[];
    if(i>0) neighbours.push([i-1,j]);
    if(i<29) neighbours.push([i+1,j]);
    if(j>0) neighbours.push([i,j-1]);
    if(j<59) neighbours.push([i,j+1]);
    return neighbours;
}
function is_equal(a,b){
    return a[0]==b[0]&&a[1]==b[1];
}
function fs(start,end,dfs=false){
    let stack=[start];
    let vis=new Set([`${start[0]}-${start[1]}`]);
    let parent=Array.from({length:30},()=>Array.from({length:60},()=>null));
    while(stack.length){    
        if(running==false)return ;
        let current=(dfs?stack.pop():stack.shift());
        if(is_equal(current,end)){
            let path=[];
            let cur=parent[current[0]][current[1]];
            while(cur&&!is_equal(cur,start)){
                path.push(cur);
                let pi=cur[0],pj=cur[1];
                cur=parent[pi][pj];
            }
            path=path.reverse();
            for(let pair of path){
                let key=`${pair[0]}-${pair[1]}`;
                let cell=document.getElementById(key);
                if(!is_equal(start,key) && !is_equal(end,key))if(cell) cell.style.backgroundColor="orange";
            }
            running=false;
            return;
        }
        let [i,j]=current;
        for(let neighbour of getNeighbours(i,j)){
            let ni=neighbour[0],nj=neighbour[1],key=`${ni}-${nj}`;
            if(map[ni][nj]=='w'||vis.has(key)) continue;
            vis.add(key);
            parent[ni][nj]=current;
            stack.push(neighbour);
            let cell=document.getElementById(key);
            if(cell && key !== `${endlis[0]}-${endlis[1]}`) cell.style.backgroundColor="pink";
        }
    }
    running=false;
}
function cleare(){
    console.log("Clearing the board...");
    for(let i=0;i<30;i++){
        for(let j=0;j<60;j++){
            let key=`${i}-${j}`;
            let cell=document.getElementById(key);
            cell.style.backgroundColor="white";
            map[i][j]='.';
        }
    }
    start=null;
    end=null;
    startlis=[];
    endlis=[];
    running=false;
    console.log("Cleared");
}
function clearslv(){
    for(let i=0;i<30;i++){
        for(let j=0;j<60;j++){
            let key=`${i}-${j}`;
            if(key==start||key==end || map[i][j]=='w') continue;
            let cell=document.getElementById(key);
            cell.style.backgroundColor="white";
            map[i][j]='.';
        }
    }
}
let mouseDown = false;

document.addEventListener("mousedown", e => {
  mouseDown = true;
  rightclick = (e.button === 2);
});
document.addEventListener("mouseup", () => {
  mouseDown = false;
  rightclick = false;
});
for (let i = 0; i < 30 ; i++) {
  for (let j = 0; j < 60; j++) {
    cell= document.getElementById(`${i}-${j}`);
    cell.addEventListener('mouseenter', () => {
        if (mouseDown) clickedbtn(i, j);
    });
  }
}