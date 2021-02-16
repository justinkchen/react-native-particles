//@flow
import React from 'react';

import { Platform, View, StyleSheet, Animated, Easing, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import type { InterpolationConfigType } from 'react-native/Libraries/Animated/src/nodes/AnimatedInterpolation';

import type { Element } from 'react';
import type { VectorType } from './entities/Vector';

export interface IAnimatedParticle {
  /** Number of particles to emit */
  path: VectorType[];

  /** The position from where the particles should be generated */
  lifetime: number;

  /** Function triggered when the particle reaches the lifetime */
  onLifeEnds: () => any;

  /** Start the animation on the initialization */
  autoStart: boolean;

  /** Start the animation on the initialization */
  style: any;

  children: Element<any>;
}

interface IAnimatedParticleState {
  animatedValue: Animated.Value;
  opacityValue: Animated.Value;
  translateX: InterpolationConfigType;
  translateY: InterpolationConfigType;
  cumulativeX: Number;
  cumulativeY: Number;
  gestureOffsetX: Number;
  gestureOffsetY: Number;
  clicked: Boolean;
  pan: Animated.ValueXY;
}

type InterpolationConfig = {
  translateX: InterpolationConfigType,
  translateY: InterpolationConfigType
};

export default class AnimatedParticle extends React.Component<
  IAnimatedParticle,
  IAnimatedParticleState
> {
  static defaultProps = {};
  panResponder = undefined;

  constructor(props: IAnimatedParticle) {
    super(props);

    const animatedValue = new Animated.Value(0);
    // animatedValue.addListener(({value}) => { 
    //   let interpolatedX = value.interpolate(this._createInterpolations(props.path).translateX).__getValue();
    //   let interpolatedY = value.interpolate(this._createInterpolations(props.path).translateY).__getValue();
    //   console.log("X", interpolatedX);
    //   console.log("Y", interpolatedY);
    //   this._xValue = interpolatedX;
    //   this._yValue = interpolatedY;
    // });
    
    this.state = {
      animatedValue,
      opacityValue: new Animated.Value(1),
      clicked: true,
      cumulativeX: 0,
      cumulativeY: 0,
      gestureOffsetX: 0,
      gestureOffsetY: 0,
      pan: undefined,
      ...this._createInterpolations(props.path)
    };

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        this.setState({ clicked: true })
        // console.log(JSON.stringify(gestureState));
        // console.log(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        // const pan = this.state.pan || new Animated.ValueXY({
        //   x: 0,
        //   y: 0
        // });;
        
        // pan.setOffset({ x: pan.x._value, y: pan.y._value });
        // // // pan.setValue({ x: 0, y: 0 });
        
        // this.setState({ pan })
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        evt.persist();
        requestAnimationFrame(() => {
          const event = evt.nativeEvent;
          // const isFirstTime = !this.state.clicked;

          // if (isFirstTime) {
          //   const pan = new Animated.ValueXY({
          //     x: animatedValue._value,
          //     y: animatedValue._value
          //   });
          //   // pan.setOffset({ x: pan.x._value, y: pan.y._value });
          //   // pan.setValue({ x: 0, y: 0 });

          //   this.setState({ pan, clicked: true });
          //   console.log("dxdy", gestureState.dx, gestureState.dy)
          //   console.log("location", evt.nativeEvent.locationX, evt.nativeEvent.locationY)
          //   console.log("pan", pan.x._value, pan.y._value)
          // }
          // if (!isFirstTime && this.state.initialX === 0) {
          //   this.setState({ 
          //     initialX: this.state.pan.x._value + evt.nativeEvent.locationX, 
          //     initialY: this.state.pan.y._value + evt.nativeEvent.locationY, 
          //     clicked: true 
          //   })
          // }

          // const pan = new Animated.ValueXY({
          //   x: (Platform.OS === 'android' ? gestureState.x0 + gestureState.dx : this.state.pan.x._value + event.locationX),
          //   y: (Platform.OS === 'android' ? gestureState.y0 + gestureState.dy : this.state.pan.y._value + event.locationY)
          // });
          // const pan = new Animated.ValueXY({
          //   x: (Platform.OS === 'android' ? gestureState.x0 + gestureState.dx : gestureState.dx),
          //   y: (Platform.OS === 'android' ? gestureState.y0 + gestureState.dy : gestureState.dy)
          // });

          // const pan = this.state.pan;
          // pan.setValue({ 
          //   x: this.state.gestureOffsetX + gestureState.dx, 
          //   y: this.state.gestureOffsetY + gestureState.dy 
          // });
          // // pan.setOffset({ x: pan.x._value, y: pan.y._value });
          // // pan.setValue({ x: 0, y: 0 });
          
          // console.log("dxdy2", gestureState.dx, gestureState.dy)
          // console.log("location2", evt.nativeEvent.locationX, evt.nativeEvent.locationY)

          // this.setState({ 
          //   pan,
          // });

          // console.log("pan", pan.x._value, pan.y._value)
        })
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // const event = evt.nativeEvent;
        // this.setState(
        //   { 
        //     gestureOffsetX: this.state.gestureOffsetX + gestureState.dx,
        //     gestureOffsetY: this.state.gestureOffsetY + gestureState.dy,
        //   }
        // );
        // this.state.pan.flattenOffset();
        // this.setState({ initialX: 0, initialY: 0 })
      }
    });
  }

  render() {
    const { children } = this.props;
    const {
      animatedValue,
      translateX,
      translateY,
      opacityValue,
      style,
      clicked,
      pan,
    } = this.state;

    const animatedStyle = pan ? {
      opacity: 1,
      transform: [
        {
          translateX: pan.x
        },
        {
          translateY: pan.y
        }
      ]
    } : {
      opacity: opacityValue,
      transform: [
        {
          translateX: animatedValue.interpolate(translateX)
        },
        {
          translateY: animatedValue.interpolate(translateY)
        }
      ]
    };

    return (
      clicked ? (
        <Animated.View style={[styles.particle, animatedStyle, style]}>
          {children}
        </Animated.View>
      ) : (
        <Animated.View style={[styles.particle, animatedStyle, style]} {...this.panResponder.panHandlers}>
          {children}
        </Animated.View>
      )
    );
  }

  componentDidMount() {
    const { autoStart } = this.props;
    autoStart && this.start();
  }

  start = () => {
    const { path, onLifeEnds, onAnimate } = this.props;
    const { animatedValue, opacityValue, clicked } = this.state;

    this.animation =
      this.animation || onAnimate(path, animatedValue, opacityValue);

    this.animation.start(() => {
      if (!this.state.clicked) {
        onLifeEnds && onLifeEnds();
      }
    });
  };

  _createInterpolations = (path: VectorType[]): InterpolationConfig => {
    const segments = path.length;

    const inputRange: number[] = new Array(segments);
    const outputRangeX: number[] = new Array(segments);
    const outputRangeY: number[] = new Array(segments);

    for (let i = 0; i < path.length; i++) {
      inputRange[i] = i;
      outputRangeX[i] = path[i].x;
      outputRangeY[i] = path[i].y;
    }

    return {
      translateX: {
        inputRange,
        outputRange: outputRangeX
      },
      translateY: {
        inputRange,
        outputRange: outputRangeY
      }
    };
  };
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
    left: 0
  }
});
