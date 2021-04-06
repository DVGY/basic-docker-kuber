export const natsWrapper = {
  client: {
    // This does not ensure publishing event
    // publish: (subject: string, data: String, callback: () => void) => {
    //   callback();
    // },

    // This ensure publishing event
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
