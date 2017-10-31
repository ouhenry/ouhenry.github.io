#关于minafest里面有很多的东西，大家熟知的又<permission>、<application>、<data>
而application里面又有许多的子标签, 比如<activity>, <service>,<broadcast>等等，
现在来总结一下<activity> 里面的属性标签。

比较常用的有<name>, <windowSoftInputMode>, <configChanges>,<launchModel>等，
除此之外还有很多比如：
与Task相关的有：
android:allowTaskReparenting
android:alwaysRetainTaskState
android:
android:allowBackUp
android:backupAgent
android:backupInForeground
android:finishOntaskLaunch
android:relinquishTaskIdentity
android:taskAffinity

与进程相关：
android:process
android:multiprocess

界面相关：
android:bannaer
android:icon
android:label
android:theme
android:screenOrientation

其中launchMode中
singleTask 和 singleInstance的区别是 singleTask Activity 允许其他Activity成为
其任务的组成部分，它始终位于其任务的根位置，但其他Activity可以启动到该任务中。

singleInstance Activity则不允许其他Activiy成为其任务的组成部分。它是任务唯一的Activity.
