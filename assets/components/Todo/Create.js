import Form from "./Form";

const Create = () => {
    return (<Form
        defaultValues={{
            users: {value: '', label: 'Choose user'},
            category: {value: '', label: 'Choose category'}
        }}
    />);
};
export default Create;


