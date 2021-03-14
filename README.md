# Slack-Clone

### Use swr to manage data and websocket to implement real-time communication

</br>

# Stack

1. React
2. React-Router-Dom
3. Axios + SWR
4. Socket-io
5. Emotion

# Route

```
<Switch>
  <Redirect exact path="/" to="/login" />
  <Route path="/signup" component={SignUp} />
  <Route path="/login" component={LogIn} />
  <Route path="/workspace/:workspace" component={Workspace} />
</Switch>

...

<Switch>
  <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
  <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
</Switch>
```

# Reusable Components

1. Modal
2. Menu
3. ChatBox
4. ChatList

# Hooks

1. InputState
2. Socket
3. SWR

# Video

https://www.youtube.com/watch?v=LOoMUus9EOM

# Reference

https://github.com/ZeroCho/sleact/tree/master/front
