import { icons } from '@/constants/icons'
import React from 'react'
import { Image, TextInput, View } from 'react-native'

interface Props {
    value?: string,
    placeholder: string,
    onPress?: () => void
    onChangeText?: (text: string) => void
}

const SearchBar = ({ value, placeholder, onPress, onChangeText }: Props) => {
    return (
        <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
            <Image source={icons.search} className='size-5' resizeMode='contain' tintColor='#ab8bff' />
            <TextInput
                value={value}
                placeholder={placeholder}
                onPress={onPress}
                onChangeText={onChangeText}
                placeholderTextColor={"#ab8bff"}
                className='flex-1 ml-2 text-white'
            />
        </View>
    )
}

export default SearchBar