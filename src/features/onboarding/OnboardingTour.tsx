import { useEffect } from 'react';
import { useApp } from '../../app/providers';
import { UsersService } from '../../services/usersService';
import { CURRENT_WIZARD_VERSION } from '../../config/constants';
import { startTour } from './tourService';

/**
 * Mounts once inside ProtectedLayout. Automatically starts the guided tour
 * for new users (onboardingCompleted = false) or when a new wizard version is
 * available (onboardingVersion < CURRENT_WIZARD_VERSION).
 *
 * After starting, marks onboarding complete in the DB so the tour does not
 * auto-trigger again. Users can re-launch manually via Help → Start Tour
 * in the Sidebar, which calls startTour() directly without updating the DB.
 */
export function OnboardingTour() {
  const { currentUser, isUserLoading } = useApp();

  useEffect(() => {
    if (isUserLoading) return;
    if (!currentUser.id) return; // still on DEFAULT_USER

    const needsTour =
      !currentUser.onboardingCompleted ||
      currentUser.onboardingVersion < CURRENT_WIZARD_VERSION;

    if (!needsTour) return;

    // Delay to let the dashboard finish rendering before highlighting elements
    const timer = setTimeout(() => {
      startTour();
      UsersService.completeOnboarding(CURRENT_WIZARD_VERSION).catch(() => {});
    }, 800);

    return () => clearTimeout(timer);
  }, [isUserLoading, currentUser.id, currentUser.onboardingCompleted, currentUser.onboardingVersion]);

  return null;
}
