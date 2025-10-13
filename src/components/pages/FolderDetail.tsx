import { useParams, useNavigate } from 'react-router-dom';

export const FolderDetail = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Folder Detail - {folderId}</h1>
            <button
                onClick={() => navigate(`/panel/folders/${folderId}/new-purchase`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                Agregar Nueva Compra 
            </button>
        </div>
    );
};
