import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Shield, Check, X, Save, Search } from "lucide-react";
import styled from "styled-components";
import toast from "react-hot-toast";
import axios from "axios";
import clienteAxios from "../config/axios";

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;

  svg {
    color: #3b82f6;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
`;

const UsersCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const PermissionsCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 1rem;
`;

const SearchWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px solid #3b82f680;
  }
`;

const UsersList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const UserItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#f3f4f6" : "transparent")};

  &:hover {
    background-color: #f9fafb;
  }
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  font-weight: 500;
  color: #111827;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const UserRole = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  color: #374151;
`;

const PermissionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SelectedUser = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const SelectedEmail = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const RoleSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
`;

const PermissionsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    font-weight: 500;
    color: #374151;
    background-color: #f9fafb;
  }

  td:first-child {
    font-weight: 500;
  }
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  cursor: pointer;

  &:checked {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Permisos = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const modules = [
    { id: "compras", label: "Compras" },
    { id: "productos", label: "Productos" },
    { id: "ventas", label: "Ventas" },
    { id: "clientes", label: "Clientes" },
    { id: "proveedores", label: "Proveedores" },
    { id: "usuarios", label: "Usuarios" },
    { id: "bancos", label: "Bancos" },
    { id: "cajas", label: "Cajas" },
    { id: "configuracion", label: "Configuración" },
  ];

  const actions = [
    { id: "ver", label: "Ver" },
    { id: "acceso", label: "Acceso" },
    { id: "crear", label: "Crear" },
    { id: "editar", label: "Editar" },
    { id: "eliminar", label: "Eliminar" },
  ];

  const fetchUsers = async () => {
    try {
      const { data } = await clienteAxios.get("/users/permissions");
      setUsers(data.users);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePermissionChange = (module, action, value) => {
    if (!selectedUser) return;

    setSelectedUser((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [module]: {
          ...prev.permisos[module],
          [action]: value,
        },
      },
    }));
  };

  const handleSavePermissions = async () => {
    try {
      console.log("Datos a enviar:", {
        permisos: selectedUser.permisos,
        rol: selectedUser.rol,
      });
      await clienteAxios.put(`/users/permissions/${selectedUser._id}`, {
        permisos: selectedUser.permisos,
        rol: selectedUser.rol,
      });
      toast.success("Permisos actualizados correctamente");
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error al actualizar permisos:", error);
      toast.error("Error al actualizar permisos");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>
          <Shield size={24} />
          Gestión de Permisos
        </Title>
      </Header>

      <ContentGrid>
        <UsersCard>
          <SearchContainer>
            <SearchWrapper>
              <Search size={20} />
              <SearchInput
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchWrapper>
          </SearchContainer>

          <UsersList>
            {users
              .filter(
                (user) =>
                  user.username
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.email?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <UserItem
                  key={user._id}
                  selected={selectedUser?._id === user._id}
                  onClick={() => setSelectedUser(user)}
                >
                  <UserInfo>
                    <UserName>{user.username}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                  <UserRole>{user.rol}</UserRole>
                </UserItem>
              ))}
          </UsersList>
        </UsersCard>

        {selectedUser && (
          <PermissionsCard>
            <PermissionsHeader>
              <div>
                <SelectedUser>{selectedUser.username}</SelectedUser>
                <SelectedEmail>{selectedUser.email}</SelectedEmail>
              </div>
              <RoleSelect
                value={selectedUser.rol}
                onChange={(e) =>
                  setSelectedUser((prev) => ({ ...prev, rol: e.target.value }))
                }
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
                <option value="VENDEDOR">Vendedor</option>
              </RoleSelect>
            </PermissionsHeader>

            <PermissionsTable>
              <thead>
                <tr>
                  <th>Módulo</th>
                  {actions.map((action) => (
                    <th key={action.id}>{action.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id}>
                    <td>{module.label}</td>
                    {actions.map((action) => (
                      <td key={action.id}>
                        <Checkbox
                          type="checkbox"
                          checked={
                            selectedUser.permisos?.[module.id]?.[action.id] ||
                            false
                          }
                          onChange={(e) =>
                            handlePermissionChange(
                              module.id,
                              action.id,
                              e.target.checked
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </PermissionsTable>

            <ButtonGroup>
              <CancelButton onClick={() => setSelectedUser(null)}>
                <X size={16} />
                Cancelar
              </CancelButton>
              <SaveButton onClick={handleSavePermissions}>
                <Save size={16} />
                Guardar Cambios
              </SaveButton>
            </ButtonGroup>
          </PermissionsCard>
        )}
      </ContentGrid>
    </Container>
  );
};

export default Permisos;
