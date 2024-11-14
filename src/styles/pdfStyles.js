// styles.js
import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    marginBottom: 5,
  },
});

export default styles;
