import { startConfetti, handleSessionState, handleResetSession, handleSubmitFeedback } from '../../../templates/js/end';

document.addEventListener('DOMContentLoaded', () => {
    startConfetti();
    handleSessionState('MultiSemantics');
    handleResetSession('MultiSemantics');
    handleSubmitFeedback('MultiSemantics');
});