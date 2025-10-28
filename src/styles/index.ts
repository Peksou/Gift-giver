import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants';

export const globalStyles = StyleSheet.create({
  gradient: { 
    flex: 1 
  },
  container: { 
    flex: 1 
  },
  header: { 
    alignItems: 'center', 
    paddingVertical: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: 'white', 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 16, 
    color: 'white', 
    textAlign: 'center' 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#333' 
  },
  card: { 
    backgroundColor: 'rgba(255,255,255,0.92)', 
    borderRadius: 20, 
    padding: 20, 
    margin: 20 
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 12 : 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  primaryButton: { 
    backgroundColor: COLORS.PRIMARY, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginVertical: 10 
  },
  secondaryButton: { 
    backgroundColor: COLORS.SECONDARY, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginVertical: 10 
  },
  disabledButton: { 
    backgroundColor: COLORS.DISABLED 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  modalContainer: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  bold: { 
    fontWeight: 'bold' 
  },
  loadingContainer: { 
    alignItems: 'center', 
    marginVertical: 20 
  },
});