import { Link, Navigate, useParams } from 'react-router-dom';

import { PATHS } from '@shared/constants/routes';
import { ROLE, ROOM_PHASE, type RoomPlayer, type RoomState } from '@shared/realtime/protocol';
import { CONNECTION, useRoomSocket } from '@shared/realtime/room-socket-context';
import { RoomSocketProvider } from '@shared/realtime/room-socket-provider';
import { sessionStore } from '@shared/services/session-store';
import { ANSWER_RESULT, QUIZ_PHASE, type QuizView } from '@shared/types/quiz';
import { ConnectionBadge } from '@shared/ui/ConnectionBadge';
import { LoadingScreen } from '@shared/ui/LoadingScreen';
import { MessageScreen } from '@shared/ui/MessageScreen';
import { BACKDROP, PartyBackdrop } from '@shared/ui/PartyBackdrop';

import { usePlayerFeedback } from '../utils/use-player-feedback';

import { PlayerFinal } from './parts/PlayerFinal';
import { PlayerHeader } from './parts/PlayerHeader';
import { PlayerIntro } from './parts/PlayerIntro';
import { PlayerLobby } from './parts/PlayerLobby';
import { PlayerQuestion } from './parts/PlayerQuestion';
import { PlayerReveal } from './parts/PlayerReveal';
import { PlayerStanding } from './parts/PlayerStanding';

type Tone = (typeof BACKDROP)[keyof typeof BACKDROP];

// The whole phone turns green or red at the reveal: readable at arm's length
// and out of the corner of an eye.
function toneFor(game: QuizView | null): Tone {
  if (game === null) return BACKDROP.STAGE;
  if (game.phase === QUIZ_PHASE.REVEAL) {
    if (game.you?.result === ANSWER_RESULT.CORRECT) return BACKDROP.GO;
    if (game.you?.result === ANSWER_RESULT.WRONG) return BACKDROP.DANGER;
    return BACKDROP.BERRY;
  }
  if (game.phase === QUIZ_PHASE.LEADERBOARD || game.phase === QUIZ_PHASE.ROUND_END || game.phase === QUIZ_PHASE.INTRO) return BACKDROP.BERRY;
  return BACKDROP.STAGE;
}

interface BodyProps {
  state: RoomState;
  me: RoomPlayer;
}

function Body({ state, me }: BodyProps) {
  const { room, game } = state;
  if (room.phase === ROOM_PHASE.LOBBY || game === null) {
    return <PlayerLobby room={room} me={me} />;
  }

  switch (game.phase) {
    case QUIZ_PHASE.INTRO:
      return <PlayerIntro game={game} />;
    case QUIZ_PHASE.QUESTION:
      // Keyed by question so the local "tapped" state cannot leak into the next one.
      return game.question === null ? null : <PlayerQuestion key={game.question_seq} game={game} question={game.question} />;
    case QUIZ_PHASE.REVEAL:
      return <PlayerReveal game={game} />;
    case QUIZ_PHASE.LEADERBOARD:
    case QUIZ_PHASE.ROUND_END:
      return <PlayerStanding game={game} myId={me.id} />;
    case QUIZ_PHASE.FINISHED:
      return game.final === null ? null : <PlayerFinal final={game.final} myId={me.id} />;
    default:
      return null;
  }
}

interface PlayerRoomProps {
  code: string;
}

function PlayerRoom({ code }: PlayerRoomProps) {
  const { status, state } = useRoomSocket();
  usePlayerFeedback(state?.game ?? null);

  const rejoin = (
    <Link to={PATHS.join} className="font-display text-[20px] font-extrabold text-stage underline">
      Join another game
    </Link>
  );

  if (status === CONNECTION.CLOSED || status === CONNECTION.GONE) {
    sessionStore.clearSeat(code);
    return <MessageScreen emoji="👋" title="That’s a wrap!" message="The host has ended the game. Thanks for playing." action={rejoin} />;
  }
  if (status === CONNECTION.REJECTED) {
    sessionStore.clearSeat(code);
    return (
      <MessageScreen
        emoji="🪑"
        title="Lost your seat"
        message="This phone is no longer in that game. Join again with the code on the big screen."
        action={
          <Link to={PATHS.joinWithCode(code)} className="font-display text-[20px] font-extrabold text-stage underline">
            Join {code} again
          </Link>
        }
      />
    );
  }
  if (state === null) {
    return <LoadingScreen label="Getting you into the game…" />;
  }

  const me = state.room.players.find((player) => player.id === state.you.player_id);
  if (me === undefined) {
    return <LoadingScreen label="Finding your seat…" />;
  }

  const inGame = state.room.phase !== ROOM_PHASE.LOBBY && state.game !== null;

  return (
    <PartyBackdrop tone={toneFor(inGame ? state.game : null)}>
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col">
        <PlayerHeader me={me} score={inGame ? (state.game?.you?.score ?? 0) : null} />
        <Body state={state} me={me} />
      </div>
      <ConnectionBadge />
    </PartyBackdrop>
  );
}

/** The phone during a game: a controller, and a mirror of your own score. */
export default function PlayerRoomScreen() {
  const { code = '' } = useParams();
  const roomCode = code.toUpperCase();
  const seat = sessionStore.getSeat(roomCode);

  // No seat on this phone for this room: go and get one.
  if (seat === null) {
    return <Navigate to={PATHS.joinWithCode(roomCode)} replace />;
  }

  return (
    <RoomSocketProvider code={roomCode} role={ROLE.PLAYER} token={seat.token}>
      <PlayerRoom code={roomCode} />
    </RoomSocketProvider>
  );
}
