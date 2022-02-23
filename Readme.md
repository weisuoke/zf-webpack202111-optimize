## CDN

- HTML放在自己的服务器上，不缓存，关闭服务器缓存，每次访问服务器都可以获取最新的资源
- 里面的静态文件 js css image 都指向CDN地址
- js css html 都放在CDN上,并且文件名带上hash值
- 为了可以并行加载，需要把不同类型的文件和不同的文件放在不同的CDN服务器上
- 为了避免同一时间对同一域名请求数并发的限制，不同的资源放在不同的域名服务进行并行加载
- dns-prefetch DNS 预解析

## 三种hash

**hash**

代表整个项目

**chunkhash**

每个入口都有自己的 chunkhash
如果本入口对应的文件发生改变，chunkhash会改变，如果没有改变，chunkhash会保持不变