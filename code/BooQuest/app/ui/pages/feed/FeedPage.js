import React from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native'
import {
    Text,
    TabBarIcon,
    Alert,
    LocalImage,
    ActionFloatButton
} from 'boo-ui/components'
import { ColorPalette } from 'boo-ui/utils'
import {
    LoggedUser,
    PublicQuestListener
} from 'boo-domain'
import CreateNewQuestModal from './CreateNewQuestModal'

export default class FeedPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            createNewQuestModalIsOpened: false,
            publicQuests: []
        }
    }

    componentDidMount() {
        this.publicQuestListener = new PublicQuestListener(this._onPublicQuestsChanged.bind(this))
    }

    componentWillUnmount() {
        this.publicQuestListener.unregister()
    }

    _onPublicQuestsChanged(publicQuests) {
        const quests = Object.keys(publicQuests || []).map((key) => {
            let parsed = publicQuests[key]
            parsed.key = key
            return parsed;
        });

        this.setState({ publicQuests: quests })
    }

    _openCreateNewQuestModal() {
        this.setState({
            createNewQuestModalIsOpened: true
        })
    }

    _closeCreateNewQuestModal() {
        this.setState({
            createNewQuestModalIsOpened: false
        })
    }

    _onQuestCreated(quest) {
        Alert.getGlobalInstance().showSuccess(`Your quest ${quest.title} was created =).`)
        this._closeCreateNewQuestModal()
    }

    _goToDetail(quest) {
        this.props.navigation.navigate('QuestDetail', { quest })
    }

    _renderHeader() {
        return (
            <View style={headerStyles.container}>
                <View style={headerStyles.content}>
                    <Text style={headerStyles.userEmail}>{LoggedUser.getCurrent().email}</Text>

                    <View style={headerNotificationStyles.container}>
                        <View style={headerNotificationStyles.content}>
                            <LocalImage.Alarm />
                            <Text style={headerNotificationStyles.counter}>0</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _renderTitle() {
        return (
            <View style={titleStyles.container}>
                <Text style={titleStyles.text}>lastest quests</Text>
                <TouchableOpacity 
                    style={titleStyles.newQuestButtonContainer}
                    onPress={this._openCreateNewQuestModal.bind(this)}>
                </TouchableOpacity>

            </View>
        )
    }

    _renderList() {
        return (
            <View style={listStyles.container}>
                <FlatList
                    style={listStyles.list}
                    data={this.state.publicQuests}
                    keyExtractor={(item, index) => item.key }
                    renderItem={this._renderListItem.bind(this)}
                />
            </View>
        )
    }

    _renderListItem({ item }) {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this._goToDetail(item)}>
                <View style={listItemStyles.container}>
                    <View>
                        <View style={listItemCommentCountStyles.container}>
                            <View style={listItemCommentCountStyles.content}>
                                <Text style={listItemCommentCountStyles.text}>{item.commentsCount}</Text>
                                <LocalImage.CommentsCount
                                    style={listItemCommentCountStyles.image}
                                    resizeMode={'contain'}
                                />
                            </View>
                        </View>

                        <Text
                            style={listItemStyles.textTitle}
                            ellipsizeMode={'tail'}
                            numberOfLines={1}>{item.title}</Text>
                        <Text
                            style={listItemStyles.textDescription}
                            ellipsizeMode={'tail'}
                            numberOfLines={2}>
                            {item.description}
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>
        )
    }

    _renderCreateQuestAction() {
        return (
            <ActionFloatButton 
                image={LocalImage.Ink}
                style={newQuestActionStyles.container}
                onPress={this._openCreateNewQuestModal.bind(this)} />
        )
    }

    _renderCreateNewQuestModal() {
        return (
            <CreateNewQuestModal
                visible={this.state.createNewQuestModalIsOpened}
                onRequestClose={this._closeCreateNewQuestModal.bind(this)}
                onComplete={this._onQuestCreated.bind(this)} />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderTitle()}
                {this._renderList()}
                {this._renderCreateQuestAction()}
                {this._renderCreateNewQuestModal()}                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
})

const headerStyles = StyleSheet.create({
    container: {
        backgroundColor: ColorPalette.purplePrimary,
        width: '100%',
        height: 66
    },
    content: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 20
    },
    userEmail: {
        fontSize: 18,
        color: ColorPalette.white
    }
})

const headerNotificationStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 30,
        width: 30,
        top: 18,
        right: 18
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 20,
        width: 20
    },
    counter: {
        position: 'absolute',
        top: 0,
        right: 0,
        fontSize: 12,
        color: ColorPalette.white
    }
})

const titleStyles = StyleSheet.create({
    container: {
        height: 35,
        width: '90%',
        marginTop: 10,
        borderColor: ColorPalette.grayLight,
        borderBottomWidth: 1
    },
    text: {
        color: ColorPalette.greenPrimary,
        fontSize: 22
    },
    newQuestButtonContainer: {
        height: 27,
        width: 27,
        position: 'absolute',
        bottom: 5,
        right: 0
    }
})

const listStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%'
    },
    list: {
        marginTop: 20,
        width: '90%'
    }
})

const listItemStyles = StyleSheet.create({
    container: {
        height: 90,
        width: '100%',
        borderColor: ColorPalette.grayUltraLight,
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
        borderRadius: 5
    },
    textTitle: {
        fontSize: 18,
        color: ColorPalette.grayDark,
        width: '80%'
    },
    textDescription: {
        marginTop: 5,
        color: ColorPalette.grayDark
    }
})

const listItemCommentCountStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 60,
        height: 30
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: ColorPalette.greenPrimary,
        marginRight: 5
    },
    image: {

    }
})

const newQuestActionStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20
    }
})