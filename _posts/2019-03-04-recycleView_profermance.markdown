在我的最近的一个项目里， 我实现一个列表里面每个item 里面包含一个水平的图片列表，就像instagram, 我面对很多问题在使用RecycleView。

如果goolge这个问题你会发现很多关于提升性能的方法，不过在我的情形里并不适用。
因此我决定分享我的问题和解决方法。

遇到的问题：
1.RecyclerView 不能流畅地滑动。
2.一些第一个items 滑动缓慢
3.横向图片滚动效果不是很好

第一个问题：

RecyclerView 不能平缓的滑动

每一个item中包含一个图片滑动器。一些文字， 一个星级栏，一个点赞按钮和一个button

你看到的并不是一个非常复杂的view,除了图片滑动器，在其他的app里面如instagram 和airbnb 他们非常完美的工作没有任何迟钝

我的第一个想法把photo slider 删除掉， 只进行评论在我的adapter 在初始化的时候。但是RecyclerView 还是不能流畅的滑动


解决问题：

1.第一件事情是关于RecylcerView 的初始化

 如果可能的话设置items 的高度在xmlfile里面，添加下面一行代码在初始化RecyclerView初始方法中

	recyclerView.setHasFixedSize(true);
这个方法，你告诉RecyclerView 不要去计算items的高度在任何时候，添加或者删除item

2. 另一个方法 ItemViewCacheSize

	recyclerView.setItemViewCacheSize();

3. setHasStableIds(true)

Dont use ConstrainLayout in RecyclerView  一些约束标签需要非常繁重的去填充。

第二个问题：

items 滑动缓慢因为onCreateViewHolder 调用6个items的第一个 ， 因此我门可以告诉RecyclerView 去加载所有的六个items在第一个初始化的的时候。

如何做呢，PreCachingLayoutManager 就是解决的办法。

最后一个问题：
使用一个横向的RecycleView 代替ViewPagers
LinearSnapHelper()

设置单一的view pool

setRecycledViewPool
