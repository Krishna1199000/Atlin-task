export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
}

export interface NoteInsert {
  title: string
  content: string
}
