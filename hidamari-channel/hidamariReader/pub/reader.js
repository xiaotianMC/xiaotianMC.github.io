// 获取窗口的宽度和高度
var width = window.innerWidth;
var height = window.innerHeight;

// 获取容器元素
const container = document.querySelector('article');

// 你也可以根据窗口大小执行不同的操作
if (width >= 700) {
    // 添加滚轮事件监听器
    container.addEventListener('wheel', function(event) {
    // 防止默认的垂直滚动行为
    event.preventDefault();

    // 获取滚轮的垂直和水平滚动量
    const deltaY = event.deltaY;
    const deltaX = event.deltaX;

    // 如果是垂直滚动，则转换为水平滚动
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // 水平方向的滚动量为垂直方向的一半，可以根据需要调整比例
        const scrollAmount = deltaY * 4;

        // 横向滚动容器
        container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
        });
    }
    });
} 
if (width < 700){
        window.removeEventListener('wheel', function(event) {
        event.preventDefault();
    });
}

// 获取所有图片元素
const images = document.querySelectorAll('img');

// 函数用于改变图片的CSS属性
function adjustImages() {
  // 获取浏览器窗口的宽度
  const width = window.innerWidth;

  // 如果窗口宽度小于700px，则改变图片的CSS属性
  
  if (width < 700) {
    images.forEach(img => {
      img.style.height = '550px'; // 高度自动调整以保持图片比例
    });
        if (width < 400) {
        images.forEach(img => {
        img.style.height = '500px'; // 高度自动调整以保持图片比例
        });
        }
        if (width < 350) {
            images.forEach(img => {
            img.style.height = '450px'; // 高度自动调整以保持图片比例
            });
        }
  } else {
    images.forEach(img => {
      img.style.height = 'calc(100dvh - 50px)'; // 高度自动调整以保持图片比例
    });
  }
}

// 在页面加载时调用函数
adjustImages();

// 添加事件监听器，以便在窗口大小变化时调用函数
window.addEventListener('resize', adjustImages);
