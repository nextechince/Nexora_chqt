import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  flex: {
    flex: 1,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding: {
    padding: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  paddingVertical: {
    paddingVertical: 16,
  },
  margin: {
    margin: 16,
  },
  marginHorizontal: {
    marginHorizontal: 16,
  },
  marginVertical: {
    marginVertical: 16,
  },
  card: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    padding: 16,
  },
  glass: {
    backgroundColor: COLORS.bgGlass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    backdropFilter: 'blur(10px)',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  shadowGlow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  text: {
    color: COLORS.textPrimary,
  },
  textSecondary: {
    color: COLORS.textSecondary,
  },
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textMuted: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 12,
    padding: 12,
    color: COLORS.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: COLORS.bgSecondary,
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonOutlineText: {
    color: COLORS.primary,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderGlass,
    marginVertical: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: '600',
  },
  badgePrimary: {
    backgroundColor: COLORS.primary,
    color: '#FFF',
  },
  badgeSuccess: {
    backgroundColor: COLORS.success,
    color: '#FFF',
  },
  badgeDanger: {
    backgroundColor: COLORS.error,
    color: '#FFF',
  },
  badgeWarning: {
    backgroundColor: COLORS.warning,
    color: '#FFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.bgPrimary,
  },
  offlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.offline,
    borderWidth: 2,
    borderColor: COLORS.bgPrimary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default globalStyles;
