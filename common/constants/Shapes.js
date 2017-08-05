import { PropTypes } from 'react';

export const user = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired
})

export const mission = PropTypes.shape({
  text: PropTypes.string.isRequired
})

export const changemaker = PropTypes.shape({
  id: PropTypes.number.isRequired,
  videoUrl: PropTypes.string.isRequired,
  approvalDate: PropTypes.string.isRequired, // serialized date
  statusUpdates: PropTypes.array,
  numberOfPatrons: PropTypes.number.isRequired,
  user: user.isRequired,
  mission: mission.isRequired
});

export const supporter = PropTypes.shape({
  id: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
});

export const children = PropTypes.oneOfType([
  PropTypes.array,
  PropTypes.node,
  PropTypes.object
]);

export const statusUpdate = PropTypes.shape({
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
});
