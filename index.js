const urlParams = new URLSearchParams(window.location.search);
const p_rank = urlParams.get('rank');
const p_suit = urlParams.get('suit');

const pokerImg = document.getElementById('poker');

pokerImg.src = `/assets/img/${p_suit}-${p_rank}.png`;

const channel = new BroadcastChannel('poker_position');
channel.onmessage = (event) => {
    const viewport = convertScreenToViewport(event.data[0], event.data[1]);
    updatePokerImgPosition(viewport[0], viewport[1]);
}

initPokerPosition();


/**
 * 将视口坐标位置转化为屏幕坐标系位置
 */
function convertViewportToScreen(x, y) {
    const screenX = x + window.screenLeft;
    const screenY = y + window.screenTop + window.outerHeight - window.innerHeight;
    return [screenX, screenY];
}
/**
 * 将屏幕坐标系位置转化为视口坐标位置
 */
function convertScreenToViewport(x, y) {
    const viewportX = x - window.screenLeft;
    const viewportY = y - window.screenTop - window.outerHeight + window.innerHeight;
    return [viewportX, viewportY];
}

/**
 * 拖动图片更新位置
 */
pokerImg.addEventListener('mousedown', (event) => {
    // 定义具名函数以便后续注销
    const moveHandler = (event) => move(event.clientX, event.clientY);
    const mouseUpHandler = (event) => {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', mouseUpHandler); // 同样注销 mouseup 事件
    };
    
    // 注册事件监听器
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
});



/**
 * 传入一个element节点，和x，y坐标，将element节点移动到视口坐标系的x，y位置
 */
function moveElementToViewport(element, x, y) {
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
}
function move(x,y) {
    moveElementToViewport(pokerImg,x, y);
    channel.postMessage(convertViewportToScreen(x, y));
}

function initPokerPosition() {
    //视口坐标正中间
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    moveElementToViewport(pokerImg,x, y);
    channel.postMessage(convertViewportToScreen(x, y));
    console.log(`玩法如下：
        1. 你可以拖动Poker
        2. 你可以多开几个同源窗口，拖动Poker可以在窗口间穿梭
        3. 每个页面可以展现不同的牌面，方法是修改URL参数，例如：?rank=2&suit=hearts。rank可选值：A; suit可选值：Clubs, Diamonds, Hearts, Spades`);
}