import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Main container
  container: {
    backgroundColor: '#fff',
    width: '90%',  // Responsive width for mobile
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // This is not directly supported; use 'elevation' in Android
    elevation: 4,  // Android equivalent of box-shadow
    marginTop: 20,
    justifyContent: 'center',
  },

  // Header
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 20,
    color: '#4CAF50',
    fontWeight: 500
  },

  // Current time display
  currentTime: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },

  card: {
    width: '100%',
    borderRadius: 5,
    borderLeftWidth: 5, // Left border with color for the zone
    marginBottom: 10,
    padding: 10,
    position: 'relative',
    shadowColor: '#000',  // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android shadow effect
  },

  iconBackground: {
    position: 'absolute',
    top: -5,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.1, // Icon background with low opacity
  },
  icon: {
    fontSize: 75, // Large icon for background effect
  },

  // Zones Information
  zonesInfo: {
    marginBottom: 10,
  },

  zonesTitle: {
    fontSize: 18,
    marginBottom: 10,
  },

  /*
  TODO: ver si meter
  zone: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',  // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android shadow effect
  },
  */

  zoneInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensures text is above background icon
  },

  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  zoneDetails: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },

  zonesCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },

  calendarLink: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
  },

  // Status box
  statusCard: {
    backgroundColor: '#f9f9f9',
    borderLeftColor: "#ccc"
  },
  
  questionsTitle: {
    fontSize: 16,
    marginBottom: 10,
  },

  questionsIcon: {
    backgroundColor: "rgb(32 58 129)", color: "#fff", textAlign: "center", borderRadius: 10, fontSize: 12, width: 16, display: "inline-block" 
  },
  
  statusQuestion: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  statusAnswer: {
    fontSize: 12,
    marginTop: 5,
    paddingLeft: 20,
  },

  answerAvailable: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  answerNoPay: {
    color: '#f44336',
    fontWeight: 'bold',
  },

  // Footer
  footer: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default styles;