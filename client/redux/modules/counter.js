/**
 * @author Candice
 * @date 2018/6/7 15:26
 */
const INCREMENT = 'counter/INCREMENT';

const initialState = {
  count: 0,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INCREMENT:
      const { count } = state;
      return {
        count: count + 1,
      };
    default:
      return state;
  }
}

export function increment() {
  return {
    type: INCREMENT,
  };
}
