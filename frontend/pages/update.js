import UpdateItem from '../components/UpdateItem';

const Edit = props => (
  <div>
    <UpdateItem id={props.query.id} />
  </div>
);

export default Edit;
