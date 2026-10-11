import { Show } from 'meemaw';
import { Link, useParams } from 'react-router-dom';

import { PATHS } from '@shared/constants/routes';
import { ROLE, ROOM_PHASE, type RoomState } from '@shared/realtime/protocol';
import { CONNECTION, useRoomSocket } from '@shared/realtime/room-socket-context';
import { RoomSocketProvider } from '@shared/realtime/room-socket-provider';
import { sessionStore } from '@shared/services/session-store';
import { QUIZ_PHASE, type QuizPhase, type QuizView } from '@shared/types/quiz';
import { ConnectionBadge } from '@shared/ui/ConnectionBadge';
import { LoadingScreen } from '@shared/ui/LoadingScreen';
import { MessageScreen } from '@shared/ui/MessageScreen';
import { BACKDROP, PartyBackdrop } from '@shared/ui/PartyBackdrop';

import { useHostSounds } from '../utils/use-host-sounds';

import { HostControlBar } from './parts/chrome/HostControlBar';
import { HostTopBar } from './parts/chrome/HostTopBar';
import { ReactionLayer } from './parts/chrome/ReactionLayer';
import { HostLobby } from './parts/lobby/HostLobby';
import { BoardStage } from './parts/results/BoardStage';
import { FinalStage } from './parts/results/FinalStage';
import { RoundEndStage } from './parts/results/RoundEndStage';
import { IntroStage } from './parts/stage/IntroStage';
import { QuestionStage } from './parts/stage/QuestionStage';

type Tone = (typeof BACKDROP)[keyof typeof BACKDROP];

// The room changes colour with the moment, so a glance from across the room
// says what is happening.
const TONE_BY_PHASE: Record<QuizPhase, Tone> = {
  [QUIZ_PHASE.INTRO]: BACKDROP.BERRY,
  [QUIZ_PHASE.QUESTION]: BACKDROP.STAGE,
  [QUIZ_PHASE.REVEAL]: BACKDROP.STAGE,
  [QUIZ_PHASE.LEADERBOARD]: BACKDROP.BERRY,
  [QUIZ_PHASE.ROUND_END]: BACKDROP.GO,
  [QUIZ_PHASE.FINISHED]: BACKDROP.STAGE,
};

const homeLink = (
  <Link to={PATHS.home} className="font-display text-[20px] font-extrabold text-stage underline">
    Back to the start
  </Link>
);

interface StageProps {
  game: QuizView;
}

function Stage({ game }: StageProps) {
  switch (game.phase) {
    case QUIZ_PHASE.INTRO:
      return <IntroStage key={`intro-${game.round}`} game={game} />;
    case QUIZ_PHASE.QUESTION:
    case QUIZ_PHASE.REVEAL:
      // No key change between question and reveal: the tiles must stay mounted
      // so the right answer lights up in place.
      return game.question === null ? null : <QuestionStage game={game} question={game.question} />;
    case QUIZ_PHASE.LEADERBOARD:
      return <BoardStage game={game} />;
    case QUIZ_PHASE.ROUND_END:
      return <RoundEndStage key={`round-${game.round}`} game={game} />;
    case QUIZ_PHASE.FINISHED:
      return game.final === null ? null : <FinalStage final={game.final} />;
    default:
      return null;
  }
}

interface LiveRoomProps {
  state: RoomState;
}

function LiveRoom({ state }: LiveRoomProps) {
  const { room, game } = state;
  const inLobby = room.phase === ROOM_PHASE.LOBBY || game === null;
  const tone = inLobby ? BACKDROP.STAGE : TONE_BY_PHASE[game.phase];
  const playing = game !== null && !inLobby && game.phase !== QUIZ_PHASE.FINISHED;

  return (
    <PartyBackdrop tone={tone}>
      <div className="flex h-screen flex-col">
        <HostTopBar room={room} game={playing ? game : null} />
        <Show when={inLobby} fallback={game === null ? null : <Stage game={game} />}>
          <HostLobby room={room} />
        </Show>
      </div>
      <Show when={playing}>{game === null ? null : <HostControlBar game={game} />}</Show>
      <ReactionLayer />
      <ConnectionBadge />
    </PartyBackdrop>
  );
}

function HostRoom() {
  const { status, state } = useRoomSocket();
  useHostSounds(state);

  if (status === CONNECTION.CLOSED) {
    return <MessageScreen emoji="👋" title="Room closed" message="That game has ended. Start a new one whenever you like." action={homeLink} />;
  }
  if (status === CONNECTION.GONE) {
    return <MessageScreen emoji="🫥" title="That room is gone" message="The game ended or the server restarted. Start a new one." action={homeLink} />;
  }
  if (status === CONNECTION.REJECTED) {
    return <MessageScreen emoji="🔑" title="Not the host here" message="This browser is not the one hosting that game." action={homeLink} />;
  }
  if (state === null) {
    return <LoadingScreen label="Opening the room…" />;
  }
  return <LiveRoom state={state} />;
}

/** The big screen for a room: lobby, every phase of the game, and the final scores. */
export default function HostRoomScreen() {
  const { code = '' } = useParams();
  const roomCode = code.toUpperCase();
  const token = sessionStore.getHostToken(roomCode);

  // Hosting is tied to the browser that opened the room. Anyone else who lands
  // here is pointed at the way in that is meant for them.
  if (token === null) {
    return (
      <MessageScreen
        emoji="📺"
        title="This is the host's screen"
        message="Only the screen that opened this game can run it. Want to play instead?"
        action={
          <Link to={PATHS.joinWithCode(roomCode)} className="font-display text-[22px] font-extrabold text-stage underline">
            Join game {roomCode}
          </Link>
        }
      />
    );
  }

  return (
    <RoomSocketProvider code={roomCode} role={ROLE.HOST} token={token}>
      <HostRoom />
    </RoomSocketProvider>
  );
}
