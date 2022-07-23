import {Text} from 'react-native';

export default function MyAppText(props) {
    return (<Text {...props} style={[{ fontFamily: 'GochiHand' }, props.style]}>{props.children}</Text>)
}