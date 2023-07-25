"use client";

import Image from "next/image";
import SignInBtn from "./SignInBtn";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

import { useToast } from "@chakra-ui/react";
import { set } from "mongoose";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

export default function UserInfo() {
  const { status, data: session } = useSession();
  const [userApps, setUserApps] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const toast = useToast();
  const [deleteSelected, setDeleteSelected] = useState({});
  const [editSelected, setEditSelected] = useState({});
  const [editedName, setEditedName] = useState("");
  const [editedProviders, setEditedProviders] = useState([{}]);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const options = [
    { value: "Google", label: "Google" },
    { value: "Facebook", label: "Facebook" },
    { value: "Binance", label: "Binance" },
    { value: "Twitter", label: "Twitter" },
    { value: "Instagram", label: "Instagram" },
    { value: "Spotify", label: "Spotify" },
    { value: "Quora", label: "Quora" },
    { value: "Tinder", label: "Tinder" },
    { value: "Bumble", label: "Bumble" },
    { value: "Bybit", label: "Bybit" },
  ];

  const submitHandler = async () => {
    // access providers array by name
    const providers = [];
    document.getElementsByName("providers").forEach((option) => {
      providers.push(option.value);
    });
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        provider: providers,
        email: session?.user?.email,
      }),
    });
    const data = await res.json();
    setUserApps([...userApps, data.data]);
    onClose();
  };

  const deleteApp = async (id) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "user-email": session?.user?.email,
      },
    });
    const userData = await res.json();
    await fetch(`${process.env.NEXTAUTH_URL}/api/project/${userData._id}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setUserApps(userApps.filter((app) => app._id !== id));
    onDeleteClose();
  };

  const handleEdit = async (editSelected) => {
    const providers = [];
    editedProviders.forEach((provider) => {
      providers.push(provider.value);
    });
    if (editedName === "") {
      setEditedName(editSelected.name);
    }
    const editedApp = {
      name: editedName,
      provider: providers,
    };
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "user-email": session?.user?.email,
      },
    });
    const userData = await res.json();
    await fetch(
      `${process.env.NEXTAUTH_URL}/api/project/${userData._id}/${editSelected._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedApp),
      }
    );
    const userAppsFetch = await fetch(
      `${process.env.NEXTAUTH_URL}/api/project/${userData._id}`
    );
    const data = await userAppsFetch.json();
    setUserApps(data);
    onEditClose();
  };

  const handleDelete = (app) => {
    return () => {
      setDeleteSelected(app);
      onDeleteOpen();
    };
  };

  const editHandler = (app) => {
    return () => {
      let providers = [];
      app.provider.forEach((provider) => {
        providers.push({ value: provider, label: provider });
      });
      const appCopy = { ...app };
      setEditedProviders(app.provider);
      appCopy.provider = providers;
      setEditSelected(appCopy);
      setEditedProviders(appCopy.provider);
      setEditedName(appCopy.name);
      onEditOpen();
    };
  };

  // do this when user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (status === "authenticated") {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-email": session?.user?.email,
          },
        });
        const userData = await res.json();
        const userAppsFetch = await fetch(
          `${process.env.NEXTAUTH_URL}/api/project/${userData._id}`
        );
        const data = await userAppsFetch.json();
        setUserApps(data);
      }
      setLoading(false);
    };
    fetchUser();
  }, [status]);

  if (status === "authenticated") {
    return (
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div>
            <Button
              colorScheme="gray"
              className="my-4"
              variant="outline"
              onClick={onOpen}
            >
              Create New App
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create New App</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Choose Provider</FormLabel>
                    <Select
                      isMulti
                      name="providers"
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="outline" onClick={submitHandler}>
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <TableContainer>
              <Table variant="striped">
                {userApps.length === 0 ? (
                  <TableCaption> No apps created yet. </TableCaption>
                ) : (
                  <TableCaption></TableCaption>
                )}
                <Thead>
                  <Tr>
                    <Th>App Name</Th>
                    <Th>Provider</Th>
                    <Th>API Key</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userApps.map((app) => (
                    <Tr key={app._id}>
                      <Td>{app.name}</Td>
                      <Td>{app.provider.toString()}</Td>
                      <Td>
                        {" "}
                        {app.api_key.slice(0, 5) +
                          "..." +
                          app.api_key.slice(-2)}{" "}
                        <CopyIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            toast({
                              title: "Copied to clipboard.",
                              description:
                                "API key has been copied to clipboard.",
                              status: "success",
                              duration: 9000,
                              isClosable: true,
                            });
                            navigator.clipboard.writeText(app.api_key);
                          }}
                        />{" "}
                      </Td>
                      <Td>
                        {" "}
                        <DeleteIcon
                          style={{ cursor: "pointer" }}
                          onClick={handleDelete(app)}
                        />{" "}
                        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Delete App</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              Are you sure you want to delete{" "}
                              <b>{deleteSelected.name}</b> app?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                variant="ghost"
                                mr={3}
                                onClick={onDeleteClose}
                              >
                                Cancel
                              </Button>
                              <Button
                                colorScheme="red"
                                variant="outline"
                                onClick={() => {
                                  deleteApp(deleteSelected._id);
                                }}
                              >
                                Delete
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                        <EditIcon
                          style={{ cursor: "pointer" }}
                          onClick={editHandler(app)}
                        />{" "}
                        <Modal isOpen={isEditOpen} onClose={onEditClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Edit App</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <FormControl>
                                <FormLabel>Name {app.name}</FormLabel>
                                <Input
                                  type="text"
                                  onChange={(e) =>
                                    setEditedName(e.target.value)
                                  }
                                  defaultValue={editSelected.name}
                                  required
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>Choose Provider </FormLabel>
                                <Select
                                  isMulti
                                  name="editedProviders"
                                  options={options}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  defaultValue={editSelected.provider}
                                  onChange={(e) => setEditedProviders(e)}
                                />
                              </FormControl>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                variant="ghost"
                                mr={3}
                                onClick={onEditClose}
                              >
                                Cancel
                              </Button>
                              <Button
                                colorScheme="gray"
                                variant="ghost"
                                onClick={() => {
                                  handleEdit(editSelected);
                                }}
                              >
                                Submit
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    );
  } else {
    return <SignInBtn />;
  }
}
