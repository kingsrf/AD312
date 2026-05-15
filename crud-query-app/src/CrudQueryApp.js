import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchPosts,
  createPost,
  updatePost,
  patchPostTitle,
  deletePost,
} from "./api";

export default function CrudQueryApp() {
  const queryClient = useQueryClient();

  const [filterInput, setFilterInput] = useState("");
  const [activeUserId, setActiveUserId] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const [editingPostId, setEditingPostId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingBody, setEditingBody] = useState("");

  const postsQueryKey = useMemo(() => ["posts", activeUserId], [activeUserId]);

  const {
    data: posts = [],
    isPending,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: postsQueryKey,
    queryFn: () => fetchPosts(activeUserId),
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (createdPost) => {
      const localPost = {
        id: createdPost.id || Date.now(),
        userId: Number(activeUserId) || 1,
        title: createdPost.title,
        body: createdPost.body,
      };

      queryClient.setQueryData(postsQueryKey, (oldPosts = []) => [
        localPost,
        ...oldPosts,
      ]);

      setNewTitle("");
      setNewBody("");
    },
    onError: () => {
      Alert.alert("Error", "Could not create the post.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(postsQueryKey, (oldPosts = []) =>
        oldPosts.map((post) =>
          post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        )
      );

      cancelEdit();
    },
    onError: () => {
      Alert.alert("Error", "Could not update the post.");
    },
  });

  const patchMutation = useMutation({
    mutationFn: patchPostTitle,
    onSuccess: (patchedPost) => {
      queryClient.setQueryData(postsQueryKey, (oldPosts = []) =>
        oldPosts.map((post) =>
          post.id === patchedPost.id
            ? { ...post, title: patchedPost.title }
            : post
        )
      );

      cancelEdit();
    },
    onError: () => {
      Alert.alert("Error", "Could not patch the post title.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: (deletedPostId) => {
      queryClient.setQueryData(postsQueryKey, (oldPosts = []) =>
        oldPosts.filter((post) => post.id !== deletedPostId)
      );

      if (editingPostId === deletedPostId) {
        cancelEdit();
      }
    },
    onError: () => {
      Alert.alert("Error", "Could not delete the post.");
    },
  });

  function applyFilter() {
    const trimmedUserId = filterInput.trim();

    if (trimmedUserId !== "" && !/^\d+$/.test(trimmedUserId)) {
      Alert.alert("Validation Error", "User ID must be a number.");
      return;
    }

    setActiveUserId(trimmedUserId);
  }

  function clearFilter() {
    setFilterInput("");
    setActiveUserId("");
  }

  function handleCreatePost() {
    const trimmedTitle = newTitle.trim();
    const trimmedBody = newBody.trim();

    if (trimmedTitle === "" || trimmedBody === "") {
      Alert.alert("Validation Error", "Title and body are required.");
      return;
    }

    createMutation.mutate({
      title: trimmedTitle,
      body: trimmedBody,
      userId: Number(activeUserId) || 1,
    });
  }

  function startEdit(post) {
    setEditingPostId(post.id);
    setEditingTitle(post.title);
    setEditingBody(post.body);
  }

  function cancelEdit() {
    setEditingPostId(null);
    setEditingTitle("");
    setEditingBody("");
  }

  function handlePutUpdate(post) {
    const trimmedTitle = editingTitle.trim();
    const trimmedBody = editingBody.trim();

    if (trimmedTitle === "" || trimmedBody === "") {
      Alert.alert("Validation Error", "Updated title and body are required.");
      return;
    }

    updateMutation.mutate({
      id: post.id,
      userId: post.userId,
      title: trimmedTitle,
      body: trimmedBody,
    });
  }

  function handlePatchTitle(post) {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === "") {
      Alert.alert("Validation Error", "Title is required for PATCH.");
      return;
    }

    patchMutation.mutate({
      id: post.id,
      title: trimmedTitle,
    });
  }

  function handleDeletePost(postId) {
    deleteMutation.mutate(postId);
  }

  function renderHeader() {
    return (
      <View>
        <Text style={styles.heading}>CRUD Query App</Text>

        <Text style={styles.subheading}>
          TanStack Query + JSONPlaceholder
        </Text>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Filter Posts</Text>

          <TextInput
            style={styles.input}
            placeholder="Filter by User ID, example: 1"
            keyboardType="numeric"
            value={filterInput}
            onChangeText={setFilterInput}
          />

          <View style={styles.row}>
            <Pressable style={styles.primaryButton} onPress={applyFilter}>
              <Text style={styles.buttonText}>Apply Filter</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={clearFilter}>
              <Text style={styles.buttonText}>Clear</Text>
            </Pressable>
          </View>

          <Text style={styles.helperText}>
            Current filter: {activeUserId || "All users"}
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Create Post</Text>

          <TextInput
            style={styles.input}
            placeholder="Post title"
            value={newTitle}
            onChangeText={setNewTitle}
          />

          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Post body"
            value={newBody}
            onChangeText={setNewBody}
            multiline
          />

          <Pressable
            style={[
              styles.primaryButton,
              createMutation.isPending && styles.disabledButton,
            ]}
            onPress={handleCreatePost}
            disabled={createMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {createMutation.isPending ? "Creating..." : "Create Post"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.listTitle}>
          Posts {isSuccess ? `(${posts.length})` : ""}
        </Text>
      </View>
    );
  }

  function renderPost({ item }) {
    const isEditing = editingPostId === item.id;

    return (
      <View style={styles.postCard}>
        <Text style={styles.postMeta}>
          Post #{item.id} | User {item.userId}
        </Text>

        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Updated title"
              value={editingTitle}
              onChangeText={setEditingTitle}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Updated body"
              value={editingBody}
              onChangeText={setEditingBody}
              multiline
            />

            <View style={styles.actionGrid}>
              <Pressable
                style={[
                  styles.primaryButton,
                  updateMutation.isPending && styles.disabledButton,
                ]}
                onPress={() => handlePutUpdate(item)}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.buttonText}>PUT Save</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.patchButton,
                  patchMutation.isPending && styles.disabledButton,
                ]}
                onPress={() => handlePatchTitle(item)}
                disabled={patchMutation.isPending}
              >
                <Text style={styles.buttonText}>PATCH Title</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={cancelEdit}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postBody}>{item.body}</Text>

            <View style={styles.actionGrid}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => startEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.deleteButton,
                  deleteMutation.isPending && styles.disabledButton,
                ]}
                onPress={() => handleDeletePost(item.id)}
                disabled={deleteMutation.isPending}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.centeredScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Loading posts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredScreen}>
        <Text style={styles.errorText}>
          {error?.message || "Error loading posts."}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        ListEmptyComponent={
          <Text style={styles.message}>No posts found for this filter.</Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eaeaea",
  },
  listContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  centeredScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaeaea",
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    color: "#222",
  },
  subheading: {
    textAlign: "center",
    color: "#555",
    marginBottom: 22,
  },
  sectionCard: {
    backgroundColor: "#f7f7f7",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 85,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    backgroundColor: "#222",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#555",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  patchButton: {
    backgroundColor: "#1d5f8a",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#8b0000",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.55,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
  helperText: {
    color: "#555",
    marginTop: 10,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: "#222",
  },
  postCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  postMeta: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
    marginBottom: 8,
  },
  postBody: {
    color: "#444",
    lineHeight: 20,
  },
  message: {
    textAlign: "center",
    color: "#555",
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#b00020",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
