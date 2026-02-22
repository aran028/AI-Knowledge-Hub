import { DomainException } from './domain-exception'

export class PlaylistNotFoundException extends DomainException {
  constructor(playlistId: string) {
    super(
      `Playlist with ID '${playlistId}' was not found`,
      { playlistId }
    )
  }
}

export class PlaylistNameAlreadyExistsException extends DomainException {
  constructor(playlistName: string, userId?: string) {
    super(
      `Playlist with name '${playlistName}' already exists${userId ? ` for user ${userId}` : ''}`,
      { playlistName, userId }
    )
  }
}

export class PlaylistAccessDeniedException extends DomainException {
  constructor(playlistId: string, userId: string, action: string) {
    super(
      `User '${userId}' does not have permission to ${action} playlist '${playlistId}'`,
      { playlistId, userId, action }
    )
  }
}

export class MaxToolsPerPlaylistExceededException extends DomainException {
  constructor(playlistId: string, maxTools: number) {
    super(
      `Playlist '${playlistId}' has reached the maximum allowed tools (${maxTools})`,
      { playlistId, maxTools }
    )
  }
}