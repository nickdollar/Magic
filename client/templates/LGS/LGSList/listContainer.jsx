import { createContainer } from 'meteor/react-meteor-data';
import ListPage from './list.jsx';

export default ListPageContainer = createContainer(({ params }) => {
    const { id } = params;
    const todosHandle = Meteor.subscribe('', id);
    const loading = !todosHandle.ready();
    const list = Lists.findOne(id);
    const listExists = !loading && !!list;
    return {
        loading,
        list,
        listExists,
        todos: listExists ? list.todos().fetch() : [],
    };
}, ListPage);