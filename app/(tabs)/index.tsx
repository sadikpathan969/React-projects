import React, { useState, useLayoutEffect } from 'react';
import { Audio } from 'expo-av';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from 'expo-router';

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Index() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ 
      tabBarStyle: { display: 'none' },
      headerShown: false 
    });
  }, [navigation]);

  const [newTaskText, setNewTaskText] = useState('');
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const playTickSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('../../assets/images/click.mp3')
  );
  await sound.playAsync();
};
  
  const handleAddTask = () => {
    if (newTaskText.trim().length === 0) return;

    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
    };

    setTodoList([...todoList, newItem]);
    setNewTaskText('');
  };
  
  const handleToggleTask = (taskId: string) => {
    const updatedList = todoList.map((item) => {
      if (item.id === taskId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setTodoList(updatedList);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTodoList(todoList.filter((item) => item.id !== taskId));
    
  };

  const renderTodoItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity
        style={styles.taskTextContainer}
        onPress={() => handleToggleTask(item.id)}
      >
        <View
          style={[
            styles.checkbox,
            item.completed && styles.checkboxCompleted,
          ]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>

        <Text
          style={[
            styles.taskText,
            item.completed && styles.taskTextCompleted,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleDeleteTask(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const remainingCount = todoList.filter(t => !t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todo List</Text>
        <Text style={styles.subtitle}>{remainingCount} tasks remaining</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={todoList}
          renderItem={renderTodoItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new task..."
            placeholderTextColor="#999"
            value={newTaskText}
            onChangeText={setNewTaskText}
            onSubmitEditing={handleAddTask}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTask}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#4A90E2', padding: 20, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
  listContent: { padding: 15, paddingBottom: 100 },
  taskContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskTextContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: { backgroundColor: '#4A90E2' },
  checkmark: { color: '#fff', fontWeight: 'bold' },
  taskText: { fontSize: 16, color: '#333', flex: 1 },
  taskTextCompleted: { textDecorationLine: 'line-through', color: '#999' },
  deleteButton: {
    width: 32,
    height: 32,
    backgroundColor: '#ff4444',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
});