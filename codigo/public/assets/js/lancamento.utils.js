function closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId)
    if (dialog) {
        dialog.close()
    }
}

const showDialog = (dialogId) => {
    const dialog = document.getElementById(dialogId)
    if (dialog) {
        dialog.showModal()
    }
}

const excluirLancamento = async (id) => {
    const confirmacao = confirm('Tem certeza que deseja excluir este lançamento?')
    if (confirmacao) {
        try {
            const status = await api.deleteLaunch(id)
            if (status === 200 || status === 204) {
                window.location.reload()
            } else {
                alert('Erro ao excluir o lançamento')
            }
        } catch (error) {
            console.error('Erro ao excluir o lançamento:', error)
        }
    }
}