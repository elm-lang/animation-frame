effect module AnimationFrame where { subscription = MySub } exposing
  ( times
  , deltas
  )

{-| Browsers have their own render loop, repainting things as fast as possible.
If you want smooth animations in your application, it is helpful to sync up
with the browsers natural refresh rate. The subscriptions in this library fire
in step with the browser so you can make sure you are not doing extra animation
frames.

**Note:** The subscriptions in this library hook into JavaScript's
`requestAnimationFrame` function.

# Animation Subscriptions
@docs times, deltas

-}

import Elm.Kernel.AnimationFrame
import Process
import Task exposing (Task)
import Time



{-| An animation frame triggers about 60 times per second.

Subscribe to get the POSIX time on each frame.
-}
times : (Time.Posix -> msg) -> Sub msg
times tagger =
  subscription (Time tagger)


{-| An animation frame triggers about 60 times per second.

Subscribe to get a message on each frame. The message is the time in
milliseconds since the previous frame. So you should get a sequence of values
all around `1000 / 60` which is nice for stepping animations by a time delta.
-}
deltas : (Int -> msg) -> Sub msg
deltas tagger =
  subscription (Delta tagger)



-- SUBSCRIPTIONS


type MySub msg
  = Time (Time.Posix -> msg)
  | Delta (Int -> msg)


subMap : (a -> b) -> MySub a -> MySub b
subMap func sub =
  case sub of
    Time tagger ->
      Time (func << tagger)

    Delta tagger ->
      Delta (func << tagger)



-- EFFECT MANAGER


type alias State msg =
  { subs : List (MySub msg)
  , request : Maybe Process.Id
  , oldTime : Int
  }


init : Task Never (State msg)
init =
  Task.succeed (State [] Nothing 0)


onEffects : Platform.Router msg Int -> List (MySub msg) -> State msg -> Task Never (State msg)
onEffects router subs {request, oldTime} =
  case (request, subs) of
    ( Nothing, [] ) ->
      Task.succeed (State [] Nothing oldTime)

    ( Just pid, [] ) ->
      Process.kill pid
        |> Task.andThen (\_ -> Task.succeed (State [] Nothing oldTime))

    ( Nothing, _ ) ->
      Process.spawn (Task.andThen (Platform.sendToSelf router) rAF)
        |> Task.andThen (\pid -> now
        |> Task.andThen (\time -> Task.succeed (State subs (Just pid) time)))

    ( Just _, _ ) ->
      Task.succeed (State subs request oldTime)


onSelfMsg : Platform.Router msg Int -> Int -> State msg -> Task Never (State msg)
onSelfMsg router newTime {subs, oldTime} =
  let
    delta =
      newTime - oldTime

    send sub =
      case sub of
        Time tagger ->
          Platform.sendToApp router (tagger (Time.millisToPosix newTime))

        Delta tagger ->
          Platform.sendToApp router (tagger delta)
  in
    Process.spawn (Task.andThen (Platform.sendToSelf router) rAF)
      |> Task.andThen (\pid -> Task.sequence (List.map send subs)
      |> Task.andThen (\_ -> Task.succeed (State subs (Just pid) newTime)))


rAF : Task x Int
rAF =
  Elm.Kernel.AnimationFrame.rAF ()


now : Task x Int
now =
  Elm.Kernel.AnimationFrame.now ()