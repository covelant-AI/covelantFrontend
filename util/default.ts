// defaultMatchData.ts
import { EventRecord } from "./types";

export const defaultMatchData: EventRecord[] = [
  // 5s → Player One wins set 1, Player Two wins set 2
  {
    setNumber: 1,
    eventTimeSeconds: 5,
    scorer: {
      id: 1,
      firstName: "Alice",
      lastName: "Anderson",
      avatar: "/avatars/alice.jpg",
      type: "PLAYER",
    },
  },
  {
    setNumber: 2,
    eventTimeSeconds: 5,
    scorer: {
      id: 2,
      firstName: "Bob",
      lastName: "Benson",
      avatar: "/avatars/bob.jpg",
      type: "PLAYER",
    },
  },

  // 13s → Alice again
  {
    setNumber: 1,
    eventTimeSeconds: 13,
    scorer: {
      id: 1,
      firstName: "Alice",
      lastName: "Anderson",
      avatar: "/avatars/alice.jpg",
      type: "PLAYER",
    },
  },
  {
    setNumber: 2,
    eventTimeSeconds: 13,
    scorer: {
      id: 2,
      firstName: "Bob",
      lastName: "Benson",
      avatar: "/avatars/bob.jpg",
      type: "PLAYER",
    },
  },

  // 46s → repeat as needed
  {
    setNumber: 1,
    eventTimeSeconds: 46,
    scorer: {
      id: 1,
      firstName: "Alice",
      lastName: "Anderson",
      avatar: "/avatars/alice.jpg",
      type: "PLAYER",
    },
  },
  {
    setNumber: 2,
    eventTimeSeconds: 46,
    scorer: {
      id: 2,
      firstName: "Bob",
      lastName: "Benson",
      avatar: "/avatars/bob.jpg",
      type: "PLAYER",
    },
  },

  // 70s
  {
    setNumber: 1,
    eventTimeSeconds: 70,
    scorer: {
      id: 1,
      firstName: "Alice",
      lastName: "Anderson",
      avatar: "/avatars/alice.jpg",
      type: "PLAYER",
    },
  },
  {
    setNumber: 2,
    eventTimeSeconds: 70,
    scorer: {
      id: 2,
      firstName: "Bob",
      lastName: "Benson",
      avatar: "/avatars/bob.jpg",
      type: "PLAYER",
    },
  },

  // 107s
  {
    setNumber: 1,
    eventTimeSeconds: 107,
    scorer: {
      id: 1,
      firstName: "Alice",
      lastName: "Anderson",
      avatar: "/avatars/alice.jpg",
      type: "PLAYER",
    },
  },
  {
    setNumber: 2,
    eventTimeSeconds: 107,
    scorer: {
      id: 2,
      firstName: "Bob",
      lastName: "Benson",
      avatar: "/avatars/bob.jpg",
      type: "PLAYER",
    },
  },
];
