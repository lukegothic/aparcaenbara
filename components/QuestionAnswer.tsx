import { Text, View } from "react-native";
import styles from '../styles';

const QuestionAnswer = ({ question, answer }) =>
    <View style={[styles.card, styles.statusCard]}>
        <Text style={styles.statusQuestion}>{question}</Text>
        <Text style={styles.statusAnswer}><Text>{answer}</Text></Text>
    </View>

export default QuestionAnswer;