/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';


class Rank extends Component {
    constructor(props){
        super(props);

        this.setState({
            idCurrentMember: '',
        });
    }
    componentDidMount(){
        AsyncStorage.getItem('idMember').then((value) => {
            if (value)
            {
              this.setState({
                  idCurrentMember: value,
              });
            }});

    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if (nextProps && nextProps.idmember)
        {
            AsyncStorage.getItem('idMember').then((value) => {
                if (value)
                {
                  this.setState({
                      idCurrentMember: nextProps.idmember,
                  });
                }});
        }
    }

    star = (list) =>{
        var resuilt = 0;
        for (let i = 0; i < list.length; i++ )
        {
            resuilt += Number(list[i].star);
        }
        return resuilt.toFixed(1);
    }

    sort = () =>{
        const { allMember } = this.props;
        if (allMember)
        {
            for (var i = 0; i < allMember.length; i++)
            {
               for (var j = i + 1; j < allMember.length; j++)
               {
                   if (this.star(allMember[i].resuilt) < this.star(allMember[j].resuilt))
                   {
                       var tam = null;
                       tam = allMember[i];
                       allMember[i] = allMember[j];
                       allMember[j] = tam;
                   }
               }
            }
            return allMember;
        } return [];
    }


    myRank = () => {
        const { allMember } = this.props;
        for (var i = 0; i < allMember.length; i++)
        {
            if (allMember[i]._id === this.props.idmember)
            {
                return (
                    <View style={styles.contentBottom}>
                    <View style={styles.index}>
                        <Text>{i + 1}</Text>
                    </View>
                    <View style={styles.profile}>
                        <Image style={styles.image} source={require('../../assets/image/english.png')} />
                        <Text style={styles.name}>
                            {allMember[i].ho} {allMember[i].ten}
                        </Text>
                    </View>
                    <View style={styles.star}>
                        <Text style={styles.starNumber}>{this.star(allMember[i].resuilt)}</Text>
                        <Icon name="star" color={'yellow'} size={25}/>
                    </View>
                </View>
                );
            }
        }
    }


    render() {
        return (
            <View style={{flex: 1}}>
            <View style={styles.container}>
                <FlatList
                showsVerticalScrollIndicator={false}
                data={this.sort()}
                renderItem={({item,index}) =>{
                    return (
                        <View style={styles.content}>
                        <View style={styles.index}>
                            <Text> {index + 1} </Text>
                        </View>
                        <View style={styles.profile}>
                            <View style={styles.wrapperImage}>
                                <Image style={styles.image} source={require('../../assets/image/english.png')} />
                                {index + 1 === 1 ?
                                    <Icon style={styles.crown} name="crown" size={20} color="yellow"/> :
                                index + 1 === 2 ?
                                    <Icon style={styles.crown} name="crown" size={20} color="gray"/> :
                                index + 1 === 3 ?
                                    <Icon style={styles.crown} name="crown" size={20} color="#9e7e20"/> : null}
                            </View>
                            <Text style={styles.name}>
                                {item.ho} {item.ten}
                            </Text>
                        </View>
                        <View style={styles.star}>
                            <Text style={styles.starNumber}>{this.star(item.resuilt)} </Text>
                            <Icon name="star" color={'yellow'} size={25}/>
                        </View>
                        </View>
                    );
                }}
                keyExtractor={item => `${item._id}`} />
            </View>
                {this.myRank()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 10, height: 0 },
        elevation: 10,
        borderRadius: 20,
        justifyContent: 'space-between',
    },
    content: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    contentBottom: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        shadowOffset: { width: 10, height: 0 },
        elevation: 10,
    },
    index: {
        backgroundColor: 'orange',
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    profile: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
    },
    image: {
        height: 30,
        width: 30,
        borderRadius: 20,
    },
    name: {
        paddingLeft: 20,
        fontSize: 13,
    },
    starNumber: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    star: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapperImage: {
        position: 'relative',
    },
    crown: {
        top: -10,
        right: -10,
        position: 'absolute',
        transform: [{ rotate: '45deg' }],
    },
});

const mapStateToProps = (state) =>{
    return {
        allMember : state.rank.data,
        idmember: state.auth.id,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Rank);
