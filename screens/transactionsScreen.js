import React from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput, Image, ToastAndroid, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config.js';

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermissions: null,
      scanned: false,
      scannedData: '',
      scannedBookId: '',
      scannedStudentId: '',
      buttonState: 'normal',
      transactionMessage: '',
      text: ''
    }
  }
  getCameraPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermissions: status === "granted",
      buttonState: id,
      scanned: false
    })
  }
  handleBarCodeScanned = async ({ type, data }) => {
    const { buttonState } = this.state

    if (buttonState === "BookId") {
      this.setState({
        scanned: true,
        scannedBookId: data,
        buttonState: 'normal'
      });
    }
    else if (buttonState === "StudentId") {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        buttonState: 'normal'
      });
    }
  }

  initiateBookIssue = async () => {
    db.collection("transactions").add({
      'studentId': this.state.scannedStudentId,
      'bookId': this.state.scannedBookId,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Issue"
    })
    db.collection("Books").doc(this.state.scannedBookId).update({
      'bookAvailability': false
    })
    db.collection("Students").doc(this.state.scannedStudentId).update({
      'numberOfBooksIssued': firebase.firestore.FieldValue.increment(1)
    })
    this.setState({
      scannedStudentId: '',
      scannedBookId: ''
    })
  }

  initiateBookReturn = async () => {
    db.collection("transactions").add({
      'studentId': this.state.scannedStudentId,
      'bookId': this.state.scannedBookId,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': "Return"
    })
    db.collection("Books").doc(this.state.scannedBookId).update({
      'bookAvailability': true
    })
    db.collection("Students").doc(this.state.scannedStudentId).update({
      'numberOfBooksIssued': firebase.firestore.FieldValue.increment(-1)
    })
    this.setState({
      scannedStudentId: '',
      scannedBookId: ''
    })
  }

  initiateBookIssue = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Issue"
    });
    db.collection("Books")
      .doc(this.state.scannedBookId)
      .update({
        bookAvailability: false
      });
    db.collection("Students")
      .doc(this.state.scannedStudentId)
      .update({
        numberOfBooksIssued: firebase.firestore.FieldValue.increment(1)
      });

    this.setState({
      scannedStudentId: "",
      scannedBookId: ""
    });
  };

  initiateBookReturn = async () => {
    db.collection("transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "Return"
    });
    db.collection("books")
      .doc(this.state.scannedBookId)
      .update({
        bookAvailability: true
      });
    db.collection("students")
      .doc(this.state.scannedStudentId)
      .update({
        numberOfBooksIssued: firebase.firestore.FieldValue.increment(-1)
      });

    this.setState({
      scannedStudentId: "",
      scannedBookId: ""
    });
  };

  checkStudentEligibilityForBookIssue = async () => {
    console.log("LineNo-136: ",this.state);
    const studentRef = await db.collection("Students").where("studentId", "==", this.state.scannedStudentId).get();
    console.log("LineNo-138: ",studentRef.docs.length);
    var isStudentEligible = "";
    if (studentRef.docs.length == 0) {
      isStudentEligible = false;
      alert("The student id doesn't exist in the database!");
    } else {
      studentRef.docs.map(doc => {
        var student = doc.data();
        if (student.numberOfBooksIssued < 2) {
          isStudentEligible = true;
        } else {
          isStudentEligible = false;
          alert("The student has already issued 2 books!");
          this.setState({
            scannedStudentId: "",
            scannedBookId: ""
          });
        }
      });
    }

    return isStudentEligible;
  };

  checkStudentEligibilityForBookReturn = async () => {
    const transactionRef = await db
      .collection("transactions")
      .where("bookId", "==", this.state.scannedBookId)
      .limit(1)
      .get();
    var isStudentEligible = "";
    transactionRef.docs.map(doc => {
      var lastBookTransaction = doc.data();
      if (lastBookTransaction.studentId === this.state.scannedStudentId) {
        isStudentEligible = true;
      } else {
        isStudentEligible = false;
        alert("The book wasn't issued by this student!");
        this.setState({
          scannedStudentId: "",
          scannedBookId: ""
        });
      }
    });
    return isStudentEligible;
  };

  checkBookEligibility = async () => {
    const bookRef = await db.collection("Books").where("bookId", "==", this.state.scannedBookId).get();
    console.log("LineNo192: ",bookRef);
    var transactionType = "";
    if (bookRef.docs.length == 0) {
      transactionType = false;
    } else {
      bookRef.docs.map(doc => {
        var book = doc.data();
        if (book.bookAvailability) {
          transactionType = "Issue";
        } else {
          transactionType = "Return";
        }
      });
    }
    return transactionType;
  };

  checkBookEligibilityForBookIssue = async () => {
    const studentRef = await db.collection("Students").where("studentId", "==", this.state.scannedStudentId).get()
    var isStudentEligible = "";
    if (studentsRef.docs.length == 0) {
      this.setState({
        scannedStudentId: '',
        scannedBookId: ''
      })
      isStudentEligible = false;
      alert("The studentId doesnot exist in the database");
    }
    else {
      studentRef.docs.map((doc) => {
        var student = doc.data();
        if (student.numberOfBooksIssued < 2) {
          isStudentEligible = true;
        }
        else {
          isStudentEligible = false;
          alert("The student has aldready issued 2 books");
        }
      })
    }
    return isStudentEligible
  }

  checkBookEligibilityForBookReturn = async () => {
    const transactionRef = await db.collection("transactions").where("bookId", "==", this.state.scannedBookId).limit(1).get()
    var isStudentEligible = "";
    transactionRef.docs.map((doc) => {
      var lastBookTransaction = doc.data();
      if (lastBookTransaction.studentId === this.state.scannedStudentId) {
        isStudentEligible: true
      }
      else {
        isStudentEligible = false;
        alert("The book wasn't issued by the student");
      }
    })
    return isStudentEligible
  }

  handleTransaction = async () => {
    var transactionType = await this.checkBookEligibility();
    console.log("LineNo-253:", transactionType)
    if (!transactionType) {
      alert("The book doesn't exist in the library database")
      this.setState({
        scannedStudentId: '',
        scannedBookId: ''
      })
    }
    else if (transactionType === "Issue") {
      console.log("this.state 257: ", this.state)
      var isStudentEligible = await this.checkStudentEligibilityForBookIssue()
      if (isStudentEligible) {
        this.initiateBookIssue();
        alert("Book issued to the student")
      }
    }
    else {
      var isStudentEligible = await this.checkStudentEligibilityForBookReturn()
      if (isStudentEligible) {
        this.initiateBookReturn();
        alert("Book returned to the library")
      }
    }
  }

  render() {
    const hasCameraPermissions = this.state.hasCameraPermissions;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if (buttonState !== "normal" && hasCameraPermissions) {
      return (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    else if (buttonState === "normal") {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" >
          <View>
            <Image
              source={require("../assets/booklogo.jpg")}
              style={{ width: 200, height: 200 }} />
            <Text style={{ textAlign: 'center', fontSize: 30 }}>Wireless Library</Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => this.setState({ scannedBookId: text })}
              placeholder="Book Id"
              value={this.state.scannedBookId} />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions("BookId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputBox}
              onChangeText={text => this.setState({ scannedStudentId: text })}
              placeholder="Student Id"
              value={this.state.scannedStudentId} />
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                this.getCameraPermissions("studentId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.submitButton}
            onPress={async () => {
              var transactionMessage = this.handleTransaction();
            }}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'gold',
    margin: 10,
    padding: 10
  },
  buttonText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 30,
    textAlign: 'center'
  },
  inputView: {
    flexDirection: 'row',
    margin: 20
  },
  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20
  },
  scanButton: {
    backgroundColor: '#66BB6A',
    width: 50,
    borderWidth: 1.5,
    borderLeftWidth: 0
  },
  submitButton: {
    backgroundColor: '#FBC02D',
    width: 100,
    height: 50,
    borderRadius: 10
  },
  submitButtonText: {
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  }
});